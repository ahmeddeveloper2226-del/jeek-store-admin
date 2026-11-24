import { asset } from '../lib/asset';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Search,
  Truck,
  User,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { useAdmin } from '../context/AdminContext';
import { formatCurrency } from '../data/catalog';

const STATUS_OPTIONS: OrderStatus[] = ['Preparing', 'In Transit', 'Delivered'];

export function OrdersTab() {
  const { orders, updateOrderStatus, language } = useAdmin();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Preparing' | 'In Transit'>('all');
  const [search, setSearch] = useState('');

  const activeOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (o.status === 'Delivered') return false;
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.items.some(
          (i) => i.name.toLowerCase().includes(q) || i.nameAr.toLowerCase().includes(q),
        )
      );
    });
  }, [orders, statusFilter, search]);

  const selectedOrder: Order | null =
    orders.find((o) => o.id === selectedOrderId && o.status !== 'Delivered') || null;

  const statusLabel = (s: OrderStatus) => {
    if (s === 'Preparing') return language === 'ar' ? 'جاري التجهيز' : 'Preparing';
    if (s === 'In Transit') return language === 'ar' ? 'في الطريق' : 'In Transit';
    return language === 'ar' ? 'تم التوصيل' : 'Delivered';
  };

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    if (nextStatus === 'Delivered' && selectedOrderId === orderId) {
      setSelectedOrderId(null);
    }
  };

  // Full Order Detail Screen
  if (selectedOrder) {
    const stepIndex =
      selectedOrder.status === 'Preparing' ? 1 : selectedOrder.status === 'In Transit' ? 2 : 3;

    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSelectedOrderId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{language === 'ar' ? 'العودة إلى الطلبات' : 'Back to Active Orders'}</span>
          </button>

          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
            #{selectedOrder.id} · {selectedOrder.date}
          </span>
        </div>

        {/* Detail Header & Status Changer */}
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <div className="space-y-1.5">
              <span className="text-xs font-mono-tabular font-semibold text-red-600 dark:text-red-400">
                {language === 'ar' ? 'تفاصيل الطلب الكاملة' : 'ORDER FULFILLMENT'}
              </span>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                {language === 'ar' ? 'طلب' : 'Order'} #{selectedOrder.id}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {language === 'ar'
                  ? 'تغيير الحالة إلى "تم التوصيل" ينقل الطلب تلقائياً إلى تبويب الطلبات السابقة.'
                  : 'Setting status to Delivered automatically moves this order to Past Orders.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1 gap-1">
                {STATUS_OPTIONS.map((statusOption) => {
                  const isActive = selectedOrder.status === statusOption;
                  return (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => handleStatusChange(selectedOrder.id, statusOption)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? statusOption === 'Delivered'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      {statusLabel(statusOption)}
                    </button>
                  );
                })}
              </div>
              <span className="font-mono-tabular text-2xl font-extrabold text-zinc-950 dark:text-white px-2">
                {formatCurrency(selectedOrder.total, language)}
              </span>
            </div>
          </div>

          {/* 3-Step Fulfillment Stepper */}
          <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
            {STATUS_OPTIONS.map((s, idx) => (
              <div key={s} className="space-y-1.5">
                <div
                  className={`h-2 w-full rounded-full ${
                    stepIndex >= idx + 1 ? 'bg-red-600' : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                />
                <span
                  className={
                    stepIndex >= idx + 1
                      ? 'text-zinc-950 dark:text-white'
                      : 'text-zinc-400 dark:text-zinc-600'
                  }
                >
                  {statusLabel(s)}
                </span>
              </div>
            ))}
          </div>

          {/* Customer, Delivery & Payment Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 dark:text-white">
                <User className="w-4 h-4 text-red-600" />
                <span>{language === 'ar' ? 'بيانات العميل' : 'Customer'}</span>
              </div>
              <p className="text-sm font-bold text-zinc-950 dark:text-white">
                {selectedOrder.customerName || 'Jeek Store Customer'}
              </p>
              <p className="font-mono-tabular text-zinc-600 dark:text-zinc-400 inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{selectedOrder.phone || '+20 100 542 8891'}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 dark:text-white">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{language === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}</span>
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                {selectedOrder.address}
              </p>
              {selectedOrder.notes && (
                <p className="text-zinc-500 dark:text-zinc-400 italic">“{selectedOrder.notes}”</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 dark:text-white">
                <CreditCard className="w-4 h-4 text-red-600" />
                <span>{language === 'ar' ? 'الدفع والملخص' : 'Payment & Summary'}</span>
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {selectedOrder.paymentMethod || 'Card / Cash on Delivery'}
              </p>
              <p className="font-mono-tabular text-zinc-600 dark:text-zinc-400">
                {selectedOrder.items.reduce((acc, i) => acc + i.quantity, 0)}{' '}
                {language === 'ar' ? 'منتجات' : 'items'} · {language === 'ar' ? 'شحن مجاني' : 'Free Shipping'}
              </p>
            </div>
          </div>
        </div>

        {/* Full Ordered Line Items */}
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="font-display text-lg font-bold text-zinc-950 dark:text-white">
            {language === 'ar' ? 'المنتجات المطلوبة' : 'Ordered Items Breakdown'}
          </h3>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {selectedOrder.items.map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={asset(item.image)}
                    alt={language === 'ar' ? item.nameAr : item.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-20 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shrink-0"
                  />
                  <div className="space-y-1">
                    <h4 className="font-display text-base font-extrabold text-zinc-950 dark:text-white">
                      {language === 'ar' ? item.nameAr : item.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <span
                        className="w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-700"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span>{language === 'ar' ? item.colorNameAr : item.colorName}</span>
                      <span>·</span>
                      <span className="font-mono-tabular">
                        {language === 'ar' ? 'المقاس:' : 'Size:'} {item.size}
                      </span>
                      <span>·</span>
                      <span className="font-mono-tabular">
                        {language === 'ar' ? 'الكمية:' : 'Qty:'} {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-end font-mono-tabular">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatCurrency(item.unitPrice, language)} × {item.quantity}
                  </p>
                  <p className="text-lg font-extrabold text-red-600 dark:text-red-500">
                    {formatCurrency(item.unitPrice * item.quantity, language)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Active Orders Workspace
  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div className="space-y-1.5">
          <span className="text-xs font-mono-tabular font-semibold text-red-600 dark:text-red-400">
            {activeOrders.length} {language === 'ar' ? 'طلبات نشطة' : 'ACTIVE ORDERS'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {language === 'ar' ? 'إدارة الطلبات' : 'Orders Queue'}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            {language === 'ar'
              ? 'افتح أي طلب لعرض التفاصيل الكاملة وتحديث الحالة. الطلبات المكتملة تنتقل تلقائياً للطلبات السابقة.'
              : 'Open any order card to inspect customer details or update fulfillment status. Delivered orders move to Past Orders.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-1 gap-1">
            {(['all', 'Preparing', 'In Transit'] as const).map((tabKey) => (
              <button
                key={tabKey}
                type="button"
                onClick={() => setStatusFilter(tabKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === tabKey
                    ? 'bg-zinc-950 text-white dark:bg-red-600'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {tabKey === 'all'
                  ? language === 'ar'
                    ? 'الكل'
                    : 'All Active'
                  : statusLabel(tabKey)}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-zinc-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                language === 'ar' ? 'ابحث برقم الطلب أو العميل...' : 'Search ID, customer, product...'
              }
              className="w-full ps-9 pe-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
            />
          </div>
        </div>
      </div>

      {/* Bigger Interactive Order Cards */}
      {activeOrders.length === 0 ? (
        <div className="py-16 rounded-2xl text-center border border-dashed border-zinc-300 dark:border-zinc-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 mx-auto text-zinc-400" />
          <p className="font-display font-bold text-zinc-950 dark:text-white">
            {language === 'ar' ? 'لا توجد طلبات نشطة حالياً' : 'All orders have been delivered'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {language === 'ar'
              ? 'يمكنك مراجعة جميع الطلبات المكتملة في تبويب الطلبات السابقة.'
              : 'Completed deliveries are archived inside Past Orders.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {activeOrders.map((order) => {
            const StatusIcon = order.status === 'In Transit' ? Truck : Clock;
            const totalUnits = order.items.reduce((sum, i) => sum + i.quantity, 0);

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                {/* Card Top: Order ID + Status Badge + Price */}
                <div className="space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 text-xs">
                        <span className="font-mono-tabular font-extrabold text-zinc-950 dark:text-white text-base">
                          #{order.id}
                        </span>
                        <span className="text-zinc-400">·</span>
                        <span className="font-mono-tabular text-zinc-500 dark:text-zinc-400">
                          {order.date}
                        </span>
                        <span className="text-zinc-400">·</span>
                        <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusLabel(order.status)}</span>
                        </span>
                      </div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {order.customerName || 'Jeek Store Customer'}
                        {order.phone ? ` · ${order.phone}` : ''}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{order.address}</span>
                      </p>
                    </div>

                    <div className="text-end">
                      <span className="font-mono-tabular text-2xl font-extrabold text-zinc-950 dark:text-white block">
                        {formatCurrency(order.total, language)}
                      </span>
                      <span className="font-mono-tabular text-xs text-zinc-500 dark:text-zinc-400">
                        {totalUnits} {language === 'ar' ? 'قطع' : 'units'}
                      </span>
                    </div>
                  </div>

                  {/* Visual Items Preview Inside Big Card */}
                  <div
                    onClick={() => setSelectedOrderId(order.id)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 cursor-pointer group"
                  >
                    {order.items.map((item, idx) => (
                      <div
                        key={`${order.id}-${item.productId}-${idx}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 transition-colors"
                      >
                        <img
                          src={asset(item.image)}
                          alt={language === 'ar' ? item.nameAr : item.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-14 rounded-lg object-cover bg-white dark:bg-zinc-900 shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="font-display text-xs font-bold text-zinc-950 dark:text-white truncate">
                            {language === 'ar' ? item.nameAr : item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                            {language === 'ar' ? item.colorNameAr : item.colorName} · {item.size} ×{item.quantity}
                          </p>
                          <p className="font-mono-tabular text-xs font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(item.unitPrice * item.quantity, language)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Direct 3-Status Changer + Enter Full Order Details */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1 gap-1">
                    {STATUS_OPTIONS.map((opt) => {
                      const active = order.status === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleStatusChange(order.id, opt)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                            active
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                          }`}
                        >
                          {statusLabel(opt)}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrderId(order.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'فتح التفاصيل' : 'Inspect Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
