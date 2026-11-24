import { asset } from '../lib/asset';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Edit3,
  MapPin,
  Phone,
  Plus,
  Search,
  Truck,
  User,
  Wrench,
  X,
} from 'lucide-react';
import { MaintenanceOrder, OrderStatus } from '../types';
import { useAdmin } from '../context/AdminContext';
import { formatCurrency } from '../data/catalog';
import { MaintenanceConfigModal } from './MaintenanceConfigModal';

const STATUS_OPTIONS: OrderStatus[] = ['Preparing', 'In Transit', 'Delivered'];

export function MaintenanceTab() {
  const {
    maintenanceOrders,
    updateMaintenanceStatus,
    toggleMaintenanceCheck,
    updateMaintenanceNotes,
    addMaintenanceOrder,
    maintenanceConfig,
    updateMaintenanceConfig,
    resetMaintenanceConfig,
    language,
  } = useAdmin();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Preparing' | 'In Transit'>('all');
  const [search, setSearch] = useState('');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  // Notes draft inside detail view
  const selectedOrder: MaintenanceOrder | null =
    maintenanceOrders.find((m) => m.id === selectedId && m.status !== 'Delivered') || null;
  const [notesDraft, setNotesDraft] = useState('');
  const [techDraft, setTechDraft] = useState('');

  // New maintenance modal fields
  const [newCustomer, setNewCustomer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newBikeModel, setNewBikeModel] = useState('Jeek Apex Carbon R1');
  const [newFrameElement, setNewFrameElement] = useState('T800 Carbon Fiber');
  const [newPackage, setNewPackage] = useState('Full Drivetrain & Brake Service');
  const [newIssue, setNewIssue] = useState('');
  const [newServiceMode, setNewServiceMode] = useState<
    'Workshop Drop-off' | 'Jeek Van Pickup & Delivery'
  >('Workshop Drop-off');
  const [newFee, setNewFee] = useState(85);
  const [newTech, setNewTech] = useState('Mostafa El-Shenawy');

  const activeJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return maintenanceOrders.filter((m) => {
      if (m.status === 'Delivered') return false;
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (!q) return true;
      return (
        m.id.toLowerCase().includes(q) ||
        m.customerName.toLowerCase().includes(q) ||
        m.bikeModel.toLowerCase().includes(q) ||
        m.servicePackage.toLowerCase().includes(q) ||
        m.technician.toLowerCase().includes(q)
      );
    });
  }, [maintenanceOrders, statusFilter, search]);

  const statusLabel = (s: OrderStatus) => {
    if (s === 'Preparing') return language === 'ar' ? 'في الورشة' : 'Preparing';
    if (s === 'In Transit') return language === 'ar' ? 'في الطريق' : 'In Transit';
    return language === 'ar' ? 'تم التسليم' : 'Delivered';
  };

  const openDetail = (order: MaintenanceOrder) => {
    setSelectedId(order.id);
    setNotesDraft(order.technicianNotes);
    setTechDraft(order.technician);
  };

  const handleStatusChange = (id: string, nextStatus: OrderStatus) => {
    updateMaintenanceStatus(id, nextStatus);
    if (nextStatus === 'Delivered' && selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const est = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
    const created: MaintenanceOrder = {
      id: `MN-${Math.floor(4100 + Math.random() * 890)}`,
      date: today,
      estimatedCompletion: est,
      status: 'Preparing',
      customerName: newCustomer.trim() || 'Walk-in Rider',
      phone: newPhone.trim() || '+20 100 000 0000',
      address: newAddress.trim() || 'Jeek Flagship Workshop, Cairo',
      serviceMode: newServiceMode,
      serviceModeAr:
        newServiceMode === 'Workshop Drop-off'
          ? 'تسليم واستلام بالورشة'
          : 'استلام وتوصيل بفان جيك',
      bikeModel: newBikeModel.trim(),
      bikeModelAr: newBikeModel.trim(),
      frameElement: newFrameElement.trim(),
      frameElementAr: newFrameElement.trim(),
      serialNumber: `JK-WS-${Math.floor(1000 + Math.random() * 8999)}`,
      servicePackage: newPackage.trim(),
      servicePackageAr: newPackage.trim(),
      reportedIssue: newIssue.trim() || 'Full safety & drivetrain calibration requested.',
      reportedIssueAr: newIssue.trim() || 'فحص أمان شامل ومعايرة ناقل الحركة.',
      technician: newTech.trim() || 'Mostafa El-Shenawy',
      technicianNotes: 'Logged at workshop intake bench.',
      checklist: [
        {
          id: 'c1',
          label: 'Frame & Fork Structural Check',
          labelAr: 'فحص سلامة الهيكل والشوكة',
          done: false,
        },
        {
          id: 'c2',
          label: 'Brake Pad & Rotor Calibration',
          labelAr: 'معايرة الفرامل والأقراص',
          done: false,
        },
        {
          id: 'c3',
          label: 'Drivetrain Degrease & Tune',
          labelAr: 'تنظيف وضبط التروس',
          done: false,
        },
      ],
      charges: [
        {
          id: 'ch1',
          label: newPackage.trim() || 'Workshop Service Package',
          labelAr: newPackage.trim() || 'باقة الصيانة بالورشة',
          cost: Number(newFee) || 75,
        },
      ],
      total: Number(newFee) || 75,
    };

    addMaintenanceOrder(created);
    setNewModalOpen(false);
    setNewCustomer('');
    setNewPhone('');
    setNewAddress('');
    setNewIssue('');
  };

  // Full Maintenance Detail View
  if (selectedOrder) {
    const completedChecks = selectedOrder.checklist.filter((c) => c.done).length;
    const stepIndex =
      selectedOrder.status === 'Preparing' ? 1 : selectedOrder.status === 'In Transit' ? 2 : 3;

    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{language === 'ar' ? 'العودة إلى طلبات الصيانة' : 'Back to Maintenance Orders'}</span>
          </button>

          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
            #{selectedOrder.id} · {selectedOrder.serialNumber}
          </span>
        </div>

        {/* Top Summary & Status Switcher */}
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <div className="space-y-1.5">
              <span className="text-xs font-mono-tabular font-semibold text-red-600 dark:text-red-400">
                {language === 'ar' ? 'بطاقة صيانة الورشة' : 'WORKSHOP SERVICE TICKET'}
              </span>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                {language === 'ar' ? selectedOrder.bikeModelAr : selectedOrder.bikeModel}
              </h2>
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {language === 'ar' ? selectedOrder.servicePackageAr : selectedOrder.servicePackage}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1 gap-1">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder.id, opt)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      selectedOrder.status === opt
                        ? opt === 'Delivered'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {statusLabel(opt)}
                  </button>
                ))}
              </div>
              <span className="font-mono-tabular text-2xl font-extrabold text-zinc-950 dark:text-white px-2">
                {selectedOrder.total > 0
                  ? formatCurrency(selectedOrder.total, language)
                  : language === 'ar'
                    ? 'بدون سعر مسبق'
                    : 'No Price Set'}
              </span>
            </div>
          </div>

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

          {/* Rider, Bike & Logistics Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 dark:text-white">
                <User className="w-4 h-4 text-red-600" />
                <span>{language === 'ar' ? 'صاحب الدراجة' : 'Rider & Contact'}</span>
              </div>
              <p className="text-sm font-bold text-zinc-950 dark:text-white">
                {selectedOrder.customerName}
              </p>
              <p className="font-mono-tabular text-zinc-600 dark:text-zinc-400 inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{selectedOrder.phone}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 dark:text-white">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{language === 'ar' ? 'الاستلام والعنوان' : 'Pickup & Address'}</span>
              </div>
              <p className="font-semibold text-red-600 dark:text-red-400">
                {language === 'ar' ? selectedOrder.serviceModeAr : selectedOrder.serviceMode}
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">{selectedOrder.address}</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 dark:text-white">
                <Calendar className="w-4 h-4 text-red-600" />
                <span>{language === 'ar' ? 'المواعيد والهيكل' : 'Schedule & Frame'}</span>
              </div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {language === 'ar' ? selectedOrder.frameElementAr : selectedOrder.frameElement}
              </p>
              <p className="font-mono-tabular text-zinc-600 dark:text-zinc-400">
                {selectedOrder.date} → {selectedOrder.estimatedCompletion}
              </p>
            </div>
          </div>
        </div>

        {/* Reported Issue + Checklist + Charges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Inspection Checklist & Tech Notes */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-bold text-red-600 dark:text-red-400">
                {language === 'ar' ? 'وصف المشكلة من العميل' : 'REPORTED RIDER SYMPTOM'}
              </span>
              <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                {language === 'ar' ? selectedOrder.reportedIssueAr : selectedOrder.reportedIssue}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-zinc-950 dark:text-white">
                  {language === 'ar' ? 'قائمة فحص الورشة' : 'Workshop Inspection Checklist'}
                </h3>
                <span className="font-mono-tabular text-xs font-bold text-red-600">
                  {completedChecks}/{selectedOrder.checklist.length}
                </span>
              </div>

              <div className="space-y-2">
                {selectedOrder.checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleMaintenanceCheck(selectedOrder.id, item.id)}
                    className={`w-full text-start p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      item.done
                        ? 'border-zinc-950 dark:border-red-600 bg-zinc-50 dark:bg-zinc-950'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-red-600'
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        item.done
                          ? 'line-through text-zinc-500 dark:text-zinc-400'
                          : 'text-zinc-950 dark:text-white'
                      }`}
                    >
                      {language === 'ar' ? item.labelAr : item.label}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                        item.done
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      {item.done && <Check className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {language === 'ar' ? 'الفني المسؤول' : 'Assigned Technician'}
                  </span>
                  <input
                    type="text"
                    value={techDraft}
                    onChange={(e) => setTechDraft(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  />
                </label>
              </div>
              <label className="space-y-1 block">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'ملاحظات الورشة' : 'Technician Bench Notes'}
                </span>
                <textarea
                  rows={2}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>
              <button
                type="button"
                onClick={() => updateMaintenanceNotes(selectedOrder.id, notesDraft, techDraft)}
                className="px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white font-bold transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'حفظ الملاحظات' : 'Save Workshop Notes'}
              </button>
            </div>
          </div>

          {/* Parts & Labor Invoice Breakdown */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs">
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-zinc-950 dark:text-white">
                {language === 'ar' ? 'تفاصيل التكلفة والقطع' : 'Parts & Labor Breakdown'}
              </h3>
              <dl className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                {selectedOrder.charges.length === 0 ? (
                  <div className="py-4 text-zinc-500 dark:text-zinc-400">
                    {language === 'ar'
                      ? 'تم حجز الخدمة من الباب للباب بدون سعر مسبق.'
                      : 'Door to Door Maintenance booked without an upfront price.'}
                  </div>
                ) : (
                  selectedOrder.charges.map((ch) => (
                    <div key={ch.id} className="py-3 flex items-center justify-between gap-3">
                      <dt className="font-medium text-zinc-700 dark:text-zinc-300">
                        {language === 'ar' ? ch.labelAr : ch.label}
                      </dt>
                      <dd className="font-mono-tabular font-bold text-zinc-950 dark:text-white">
                        {formatCurrency(ch.cost, language)}
                      </dd>
                    </div>
                  ))
                )}
              </dl>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-zinc-950 dark:text-white">
                {language === 'ar' ? 'إجمالي الصيانة' : 'Total Service Fee'}
              </span>
              <span className="font-mono-tabular text-xl font-extrabold text-red-600 dark:text-red-500">
                {selectedOrder.total > 0
                  ? formatCurrency(selectedOrder.total, language)
                  : language === 'ar'
                    ? 'بدون سعر مسبق'
                    : 'No Price Set'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div className="space-y-1.5">
          <span className="text-xs font-mono-tabular font-semibold text-red-600 dark:text-red-400">
            {activeJobs.length} {language === 'ar' ? 'تذاكر صيانة نشطة' : 'ACTIVE SERVICE TICKETS'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {language === 'ar' ? 'طلبات الصيانة' : 'Maintenance Orders'}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            {language === 'ar'
              ? 'متابعة فحص الدراجات، قوائم الصيانة، وتكاليف القطع وتحديث حالة التسليم.'
              : 'Inspect workshop intake tickets, update diagnostic checklists, and advance bikes from Preparing to Delivered.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setConfigModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-red-600 text-xs font-bold text-zinc-950 dark:text-white transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-red-600" />
            <span>
              {language === 'ar' ? 'تعديل تفاصيل خدمة الصيانة' : 'Edit Storefront Service'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'تسجيل طلب صيانة' : 'Log Maintenance Order'}</span>
          </button>
        </div>
      </div>

      {/* Storefront Door-to-Door Maintenance Configuration Card */}
      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-start gap-4 min-w-0">
          <img
            src={asset(maintenanceConfig.galleryImages[0])}
            alt={language === 'ar' ? maintenanceConfig.titleAr : maintenanceConfig.titleEn}
            className="w-24 h-20 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shrink-0"
          />
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono-tabular font-bold text-red-600 dark:text-red-400">
                {language === 'ar'
                  ? 'بطاقة الصيانة في متجر العملاء'
                  : 'CUSTOMER STOREFRONT SERVICE'}
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                {language === 'ar' ? maintenanceConfig.pickupModeAr : maintenanceConfig.pickupModeEn} ·{' '}
                {language === 'ar' ? maintenanceConfig.turnaroundAr : maintenanceConfig.turnaroundEn}
              </span>
            </div>
            <h2 className="font-display text-lg font-extrabold text-zinc-950 dark:text-white truncate">
              {language === 'ar' ? maintenanceConfig.titleAr : maintenanceConfig.titleEn}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {maintenanceConfig.maintenanceTypes.length}{' '}
              {language === 'ar' ? 'أنواع صيانة' : 'maintenance types'} ·{' '}
              {maintenanceConfig.bikeModels.length}{' '}
              {language === 'ar' ? 'موديلات دراجات' : 'bike models'} ·{' '}
              {maintenanceConfig.frameMaterials.length}{' '}
              {language === 'ar' ? 'خامات هيكل' : 'frame materials'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setConfigModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'تعديل خيارات الصيانة' : 'Edit Service Details'}</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-1 gap-1">
          {(['all', 'Preparing', 'In Transit'] as const).map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setStatusFilter(tabKey)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
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

        <div className="relative min-w-[230px]">
          <Search className="w-4 h-4 text-zinc-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === 'ar' ? 'ابحث بالدراجة أو الفني...' : 'Search ticket, bike, rider...'
            }
            className="w-full ps-9 pe-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* Big Interactive Maintenance Order Cards */}
      {activeJobs.length === 0 ? (
        <div className="py-16 rounded-2xl text-center border border-dashed border-zinc-300 dark:border-zinc-800 space-y-2">
          <Wrench className="w-10 h-10 mx-auto text-zinc-400" />
          <p className="font-display font-bold text-zinc-950 dark:text-white">
            {language === 'ar'
              ? 'جميع طلبات الصيانة تم تسليمها'
              : 'All maintenance tickets delivered'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {activeJobs.map((job) => {
            const doneCount = job.checklist.filter((c) => c.done).length;
            const StatusIcon = job.status === 'In Transit' ? Truck : Clock;

            return (
              <article
                key={job.id}
                className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono-tabular font-extrabold text-base text-zinc-950 dark:text-white">
                          #{job.id}
                        </span>
                        <span className="text-zinc-400">·</span>
                        <span className="font-mono-tabular text-zinc-500 dark:text-zinc-400">
                          {job.date} → {job.estimatedCompletion}
                        </span>
                        <span className="text-zinc-400">·</span>
                        <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusLabel(job.status)}</span>
                        </span>
                      </div>
                      <h2
                        onClick={() => openDetail(job)}
                        className="font-display text-xl font-extrabold text-zinc-950 dark:text-white hover:text-red-600 transition-colors cursor-pointer"
                      >
                        {language === 'ar' ? job.bikeModelAr : job.bikeModel}
                      </h2>
                      <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        {language === 'ar' ? job.servicePackageAr : job.servicePackage}
                      </p>
                    </div>

                    <div className="text-end">
                      <span className="font-mono-tabular text-lg font-extrabold text-zinc-950 dark:text-white block">
                        {job.total > 0
                          ? formatCurrency(job.total, language)
                          : language === 'ar'
                            ? 'بدون سعر مسبق'
                            : 'No Price'}
                      </span>
                      <span className="font-mono-tabular text-xs text-zinc-500 dark:text-zinc-400">
                        {doneCount}/{job.checklist.length} {language === 'ar' ? 'فحوصات' : 'checks'}
                      </span>
                    </div>
                  </div>

                  {/* Maintenance Details Strip */}
                  <div
                    onClick={() => openDetail(job)}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5 text-xs cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-zinc-950 dark:text-white">
                        {job.customerName} · {job.phone}
                      </span>
                      <span className="font-mono-tabular text-zinc-500 dark:text-zinc-400">
                        {language === 'ar' ? 'الفني:' : 'Tech:'} {job.technician}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {language === 'ar' ? job.reportedIssueAr : job.reportedIssue}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                      <span>{language === 'ar' ? job.frameElementAr : job.frameElement}</span>
                      <span>·</span>
                      <span>{language === 'ar' ? job.serviceModeAr : job.serviceMode}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Status Selector & Open Details */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1 gap-1">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleStatusChange(job.id, opt)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                          job.status === opt
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                        }`}
                      >
                        {statusLabel(opt)}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => openDetail(job)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تفاصيل الصيانة' : 'Inspect Workshop'}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Log New Maintenance Order Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setNewModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <form
            onSubmit={handleCreateMaintenance}
            className="relative z-10 w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-zinc-950 dark:text-white">
                {language === 'ar' ? 'تسجيل طلب صيانة جديد' : 'Log New Maintenance Ticket'}
              </h2>
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs max-h-[75vh] overflow-y-auto">
              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'اسم العميل *' : 'Customer Name *'}
                </span>
                <input
                  type="text"
                  required
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'رقم الهاتف *' : 'Phone *'}
                </span>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'موديل الدراجة *' : 'Bike Model *'}
                </span>
                <input
                  type="text"
                  required
                  value={newBikeModel}
                  onChange={(e) => setNewBikeModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'خامة الهيكل' : 'Frame Element'}
                </span>
                <input
                  type="text"
                  value={newFrameElement}
                  onChange={(e) => setNewFrameElement(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'باقة الصيانة *' : 'Service Package *'}
                </span>
                <input
                  type="text"
                  required
                  value={newPackage}
                  onChange={(e) => setNewPackage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'طريقة التسليم' : 'Service Mode'}
                </span>
                <select
                  value={newServiceMode}
                  onChange={(e) =>
                    setNewServiceMode(
                      e.target.value as 'Workshop Drop-off' | 'Jeek Van Pickup & Delivery',
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                >
                  <option value="Workshop Drop-off">Workshop Drop-off</option>
                  <option value="Jeek Van Pickup & Delivery">Jeek Van Pickup & Delivery</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الفني المسؤول' : 'Technician'}
                </span>
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'التكلفة التقديرية (ج.م)' : 'Estimated Fee (EGP)'}
                </span>
                <input
                  type="number"
                  min={1}
                  value={newFee}
                  onChange={(e) => setNewFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                />
              </label>

              <label className="sm:col-span-2 space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'العنوان' : 'Address'}
                </span>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="sm:col-span-2 space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'المشكلة المبلغ عنها' : 'Reported Issue & Notes'}
                </span>
                <textarea
                  rows={2}
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                {language === 'ar' ? 'إنشاء التذكرة' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      )}
      {configModalOpen && (
        <MaintenanceConfigModal
          initialConfig={maintenanceConfig}
          onClose={() => setConfigModalOpen(false)}
          onSave={(updated) => {
            updateMaintenanceConfig(updated);
            setConfigModalOpen(false);
          }}
          onReset={resetMaintenanceConfig}
        />
      )}
    </div>
  );
}
