import { asset } from '../lib/asset';
import { useMemo, useState } from 'react';
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Package,
  RotateCcw,
  Search,
  Wrench,
} from 'lucide-react';
import { MaintenanceOrder, Order } from '../types';
import { useAdmin } from '../context/AdminContext';
import { formatCurrency } from '../data/catalog';

type PastFilter = 'all' | 'store' | 'maintenance';

type SelectedPast =
  | { kind: 'store'; data: Order }
  | { kind: 'maintenance'; data: MaintenanceOrder };

export function PastOrdersTab() {
  const {
    orders,
    maintenanceOrders,
    updateOrderStatus,
    updateMaintenanceStatus,
    language,
  } = useAdmin();

  const [filter, setFilter] = useState<PastFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SelectedPast | null>(null);

  const deliveredStore = useMemo(
    () => orders.filter((o) => o.status === 'Delivered'),
    [orders],
  );
  const deliveredMaint = useMemo(
    () => maintenanceOrders.filter((m) => m.status === 'Delivered'),
    [maintenanceOrders],
  );

  const totalRevenue =
    deliveredStore.reduce((s, o) => s + o.total, 0) +
    deliveredMaint.reduce((s, m) => s + m.total, 0);

  const q = search.trim().toLowerCase();

  const visibleStore = useMemo(() => {
    if (filter === 'maintenance') return [];
    return deliveredStore.filter(
      (o) =>
        !q ||
        o.id.toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q)),
    );
  }, [deliveredStore, filter, q]);

  const visibleMaint = useMemo(() => {
    if (filter === 'store') return [];
    return deliveredMaint.filter(
      (m) =>
        !q ||
        m.id.toLowerCase().includes(q) ||
        m.customerName.toLowerCase().includes(q) ||
        m.bikeModel.toLowerCase().includes(q),
    );
  }, [deliveredMaint, filter, q]);

  // Detail View for a Past Order (Store or Maintenance)
  if (selected) {
    if (selected.kind === 'store') {
      const order = orders.find((o) => o.id === selected.data.id) || selected.data;
      return (
        <div className="space-y-8">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{language === 'ar' ? 'العودة للطلبات السابقة' : 'Back to Past Orders'}</span>
          </button>

          <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'ar' ? 'طلب متجر مكتمل' : 'DELIVERED STORE ORDER'}</span>
                </span>
                <h2 className="font-display text-3xl font-extrabold text-zinc-950 dark:text-white">
                  #{order.id}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {order.customerName || 'Jeek Store Customer'} · {order.date} · {order.address}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono-tabular text-2xl font-extrabold text-zinc-950 dark:text-white">
                  {formatCurrency(order.total, language)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(order.id, 'In Transit');
                    setSelected(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إعادة للطلبات النشطة' : 'Reopen to In Transit'}</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={asset(item.image)}
                      alt={language === 'ar' ? item.nameAr : item.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800"
                    />
                    <div>
                      <p className="font-display text-sm font-bold text-zinc-950 dark:text-white">
                        {language === 'ar' ? item.nameAr : item.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {language === 'ar' ? item.colorNameAr : item.colorName} · {item.size} ×{item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono-tabular text-base font-extrabold text-zinc-950 dark:text-white">
                    {formatCurrency(item.unitPrice * item.quantity, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const job =
      maintenanceOrders.find((m) => m.id === selected.data.id) || selected.data;
    return (
      <div className="space-y-8">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{language === 'ar' ? 'العودة للطلبات السابقة' : 'Back to Past Orders'}</span>
        </button>

        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'طلب صيانة مكتمل' : 'DELIVERED MAINTENANCE ORDER'}</span>
              </span>
              <h2 className="font-display text-3xl font-extrabold text-zinc-950 dark:text-white">
                #{job.id} · {language === 'ar' ? job.bikeModelAr : job.bikeModel}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {job.customerName} · {job.phone} · {job.technician}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono-tabular text-xl font-extrabold text-zinc-950 dark:text-white">
                {job.total > 0
                  ? formatCurrency(job.total, language)
                  : language === 'ar'
                    ? 'بدون سعر مسبق'
                    : 'No Price Set'}
              </span>
              <button
                type="button"
                onClick={() => {
                  updateMaintenanceStatus(job.id, 'In Transit');
                  setSelected(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إعادة للصيانة النشطة' : 'Reopen Ticket'}</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
            {job.technicianNotes}
          </p>

          <dl className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {job.charges.map((ch) => (
              <div key={ch.id} className="py-3 flex justify-between">
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? ch.labelAr : ch.label}
                </dt>
                <dd className="font-mono-tabular font-bold text-zinc-950 dark:text-white">
                  {formatCurrency(ch.cost, language)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Summary Strip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div className="space-y-1.5">
          <span className="text-xs font-mono-tabular font-semibold text-emerald-600 dark:text-emerald-400">
            {deliveredStore.length + deliveredMaint.length}{' '}
            {language === 'ar' ? 'طلبات منجزة' : 'DELIVERED ARCHIVE'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {language === 'ar' ? 'الطلبات السابقة' : 'Past Orders'}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            {language === 'ar'
              ? 'أرشيف جميع طلبات المتجر وطلبات الصيانة التي تم تحويل حالتها إلى "تم التوصيل".'
              : 'Completed store deliveries and signed-off maintenance tickets archived once marked Delivered.'}
          </p>
        </div>

        <div className="flex items-center gap-6 px-5 py-3 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
              {language === 'ar' ? 'إجمالي المنجز' : 'Delivered Revenue'}
            </span>
            <span className="font-mono-tabular text-xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(totalRevenue, language)}
            </span>
          </div>
          <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
              {language === 'ar' ? 'المتجر / الصيانة' : 'Store / Workshop'}
            </span>
            <span className="font-mono-tabular text-xl font-extrabold text-red-600 dark:text-red-500">
              {deliveredStore.length} / {deliveredMaint.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-1 gap-1">
          {[
            { key: 'all' as PastFilter, en: 'All Delivered', ar: 'الكل' },
            { key: 'store' as PastFilter, en: 'Store Orders', ar: 'طلبات المتجر' },
            { key: 'maintenance' as PastFilter, en: 'Maintenance', ar: 'طلبات الصيانة' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filter === tab.key
                  ? 'bg-zinc-950 text-white dark:bg-red-600'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {language === 'ar' ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-zinc-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث في الأرشيف...' : 'Search delivered history...'}
            className="w-full ps-9 pe-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {visibleStore.length === 0 && visibleMaint.length === 0 ? (
        <div className="py-16 rounded-2xl text-center border border-dashed border-zinc-300 dark:border-zinc-800 space-y-2">
          <Archive className="w-10 h-10 mx-auto text-zinc-400" />
          <p className="font-display font-bold text-zinc-950 dark:text-white">
            {language === 'ar' ? 'لا توجد طلبات مطابقة في الأرشيف' : 'No delivered orders match your filter'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {visibleStore.map((order) => (
            <article
              key={`past-store-${order.id}`}
              className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Package className="w-3.5 h-3.5 text-red-600" />
                      <span className="font-mono-tabular font-extrabold text-base text-zinc-950 dark:text-white">
                        #{order.id}
                      </span>
                      <span className="text-zinc-400">·</span>
                      <span className="font-mono-tabular text-zinc-500">{order.date}</span>
                      <span className="text-zinc-400">·</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تم التوصيل' : 'Delivered'}</span>
                      </span>
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {order.customerName || 'Jeek Store Customer'}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>{order.address}</span>
                    </p>
                  </div>

                  <span className="font-mono-tabular text-2xl font-extrabold text-zinc-950 dark:text-white">
                    {formatCurrency(order.total, language)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs"
                    >
                      <img
                        src={asset(item.image)}
                        alt={language === 'ar' ? item.nameAr : item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-zinc-950 dark:text-white">
                          {language === 'ar' ? item.nameAr : item.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {item.size} · ×{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => updateOrderStatus(order.id, 'In Transit')}
                  className="text-xs font-semibold text-zinc-500 hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إرجاع للنشطة' : 'Reopen'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelected({ kind: 'store', data: order })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Receipt'}</span>
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </article>
          ))}

          {visibleMaint.map((job) => (
            <article
              key={`past-maint-${job.id}`}
              className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Wrench className="w-3.5 h-3.5 text-red-600" />
                      <span className="font-mono-tabular font-extrabold text-base text-zinc-950 dark:text-white">
                        #{job.id}
                      </span>
                      <span className="text-zinc-400">·</span>
                      <span className="font-mono-tabular text-zinc-500">{job.date}</span>
                      <span className="text-zinc-400">·</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تم التسليم' : 'Delivered'}</span>
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-extrabold text-zinc-950 dark:text-white">
                      {language === 'ar' ? job.bikeModelAr : job.bikeModel}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {job.customerName} · {language === 'ar' ? job.servicePackageAr : job.servicePackage}
                    </p>
                  </div>

                  <span className="font-mono-tabular text-lg font-extrabold text-zinc-950 dark:text-white">
                    {job.total > 0
                      ? formatCurrency(job.total, language)
                      : language === 'ar'
                        ? 'بدون سعر مسبق'
                        : 'No Price'}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                  {job.technicianNotes}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => updateMaintenanceStatus(job.id, 'In Transit')}
                  className="text-xs font-semibold text-zinc-500 hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إرجاع للصيانة' : 'Reopen'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelected({ kind: 'maintenance', data: job })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Service Log'}</span>
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
