import { asset } from '../lib/asset';
import { useState } from 'react';
import { ImagePlus, Plus, RotateCcw, Trash2, Upload, Wrench, X } from 'lucide-react';
import { MaintenanceOptionItem, MaintenanceServiceConfig } from '../types';
import { useAdmin } from '../context/AdminContext';
import { STUDIO_IMAGE_PRESETS } from '../data/maintenance';

interface MaintenanceConfigModalProps {
  initialConfig: MaintenanceServiceConfig;
  onClose: () => void;
  onSave: (config: MaintenanceServiceConfig) => void;
  onReset: () => void;
}

export function MaintenanceConfigModal({
  initialConfig,
  onClose,
  onSave,
  onReset,
}: MaintenanceConfigModalProps) {
  const { language } = useAdmin();

  const [titleEn, setTitleEn] = useState(initialConfig.titleEn);
  const [titleAr, setTitleAr] = useState(initialConfig.titleAr);
  const [kickerEn, setKickerEn] = useState(initialConfig.kickerEn);
  const [kickerAr, setKickerAr] = useState(initialConfig.kickerAr);
  const [badgeEn, setBadgeEn] = useState(initialConfig.badgeEn);
  const [badgeAr, setBadgeAr] = useState(initialConfig.badgeAr);
  const [descriptionEn, setDescriptionEn] = useState(initialConfig.descriptionEn);
  const [descriptionAr, setDescriptionAr] = useState(initialConfig.descriptionAr);

  const [pickupModeLabelEn, setPickupModeLabelEn] = useState(initialConfig.pickupModeLabelEn);
  const [pickupModeLabelAr, setPickupModeLabelAr] = useState(initialConfig.pickupModeLabelAr);
  const [pickupModeEn, setPickupModeEn] = useState(initialConfig.pickupModeEn);
  const [pickupModeAr, setPickupModeAr] = useState(initialConfig.pickupModeAr);

  const [turnaroundLabelEn, setTurnaroundLabelEn] = useState(initialConfig.turnaroundLabelEn);
  const [turnaroundLabelAr, setTurnaroundLabelAr] = useState(initialConfig.turnaroundLabelAr);
  const [turnaroundEn, setTurnaroundEn] = useState(initialConfig.turnaroundEn);
  const [turnaroundAr, setTurnaroundAr] = useState(initialConfig.turnaroundAr);

  const [galleryImages, setGalleryImages] = useState<string[]>(initialConfig.galleryImages);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [highlights, setHighlights] = useState<MaintenanceOptionItem[]>(initialConfig.highlights);
  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceOptionItem[]>(
    initialConfig.maintenanceTypes,
  );
  const [bikeModels, setBikeModels] = useState<MaintenanceOptionItem[]>(initialConfig.bikeModels);
  const [allowCustomBike, setAllowCustomBike] = useState(initialConfig.allowCustomBike);
  const [frameMaterials, setFrameMaterials] = useState<MaintenanceOptionItem[]>(
    initialConfig.frameMaterials,
  );

  // Add-row drafts
  const [newHighlightEn, setNewHighlightEn] = useState('');
  const [newHighlightAr, setNewHighlightAr] = useState('');

  const [newTypeEn, setNewTypeEn] = useState('');
  const [newTypeAr, setNewTypeAr] = useState('');

  const [newBikeEn, setNewBikeEn] = useState('');
  const [newBikeAr, setNewBikeAr] = useState('');

  const [newFrameEn, setNewFrameEn] = useState('');
  const [newFrameAr, setNewFrameAr] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setGalleryImages((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (!galleryImages.includes(trimmed)) {
      setGalleryImages((prev) => [...prev, trimmed]);
    }
    setNewImageUrl('');
  };

  const togglePresetImage = (url: string) => {
    setGalleryImages((prev) => {
      if (prev.includes(url)) {
        return prev.length > 1 ? prev.filter((item) => item !== url) : prev;
      }
      return [...prev, url];
    });
  };

  const updateListItem = (
    setter: React.Dispatch<React.SetStateAction<MaintenanceOptionItem[]>>,
    id: string,
    field: 'en' | 'ar',
    value: string,
  ) => {
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeListItem = (
    setter: React.Dispatch<React.SetStateAction<MaintenanceOptionItem[]>>,
    id: string,
    minCount = 1,
  ) => {
    setter((prev) => (prev.length > minCount ? prev.filter((item) => item.id !== id) : prev));
  };

  const addListItem = (
    setter: React.Dispatch<React.SetStateAction<MaintenanceOptionItem[]>>,
    enVal: string,
    arVal: string,
    clearEn: (v: string) => void,
    clearAr: (v: string) => void,
    prefix: string,
  ) => {
    const cleanEn = enVal.trim();
    const cleanAr = arVal.trim() || cleanEn;
    if (!cleanEn) return;
    setter((prev) => [
      ...prev,
      {
        id: `${prefix}-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 99)}`,
        en: cleanEn,
        ar: cleanAr,
      },
    ]);
    clearEn('');
    clearAr('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeHighlights = highlights.filter((h) => h.en.trim() || h.ar.trim());
    const safeTypes = maintenanceTypes.filter((t) => t.en.trim() || t.ar.trim());
    const safeBikes = bikeModels.filter((b) => b.en.trim() || b.ar.trim());
    const safeFrames = frameMaterials.filter((f) => f.en.trim() || f.ar.trim());

    onSave({
      titleEn: titleEn.trim() || 'Door to Door Maintenance',
      titleAr: titleAr.trim() || titleEn.trim() || 'صيانة من الباب للباب',
      kickerEn: kickerEn.trim() || 'Workshop Care · Van Pickup',
      kickerAr: kickerAr.trim() || kickerEn.trim() || 'خدمة صيانة متنقلة',
      badgeEn: badgeEn.trim() || 'Door to Door',
      badgeAr: badgeAr.trim() || badgeEn.trim() || 'من الباب للباب',
      descriptionEn: descriptionEn.trim(),
      descriptionAr: descriptionAr.trim() || descriptionEn.trim(),
      pickupModeLabelEn: pickupModeLabelEn.trim() || 'Pickup Mode',
      pickupModeLabelAr: pickupModeLabelAr.trim() || 'طريقة الاستلام',
      pickupModeEn: pickupModeEn.trim() || 'Jeek Van Pickup',
      pickupModeAr: pickupModeAr.trim() || 'فان جيك المتنقل',
      turnaroundLabelEn: turnaroundLabelEn.trim() || 'Turnaround',
      turnaroundLabelAr: turnaroundLabelAr.trim() || 'مدة التنفيذ المتوقعة',
      turnaroundEn: turnaroundEn.trim() || '24 - 48 Hours',
      turnaroundAr: turnaroundAr.trim() || '٢٤ - ٤٨ ساعة',
      galleryImages:
        galleryImages.length > 0
          ? galleryImages
          : ['/src/assets/images/maintenance_door_to_door_1795444135290.jpg'],
      highlights: safeHighlights.length > 0 ? safeHighlights : initialConfig.highlights,
      maintenanceTypes: safeTypes.length > 0 ? safeTypes : initialConfig.maintenanceTypes,
      bikeModels: safeBikes.length > 0 ? safeBikes : initialConfig.bikeModels,
      allowCustomBike,
      frameMaterials: safeFrames.length > 0 ? safeFrames : initialConfig.frameMaterials,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/65 backdrop-blur-xs" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-4xl max-h-[92vh] rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Sticky Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono-tabular font-bold text-red-600 dark:text-red-400">
                {language === 'ar'
                  ? 'تخصيص صفحة الصيانة بالمتجر'
                  : 'STOREFRONT MAINTENANCE EDITOR'}
              </span>
              <h2 className="font-display text-lg font-extrabold text-zinc-950 dark:text-white">
                {language === 'ar'
                  ? 'تعديل تفاصيل خدمة الصيانة من الباب للباب'
                  : 'Edit Door to Door Maintenance Details'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-xs">
          {/* Section 1: Service Identity & Copy */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2">
              {language === 'ar'
                ? '١. العنوان والوصف المعروض للعميل'
                : '1. Service Presentation & Copy'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'اسم الخدمة (EN) *' : 'Service Title (EN) *'}
                </span>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'اسم الخدمة (AR) *' : 'Service Title (AR) *'}
                </span>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'العنوان الفرعي العلوي (EN)' : 'Top Kicker Label (EN)'}
                </span>
                <input
                  type="text"
                  value={kickerEn}
                  onChange={(e) => setKickerEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'العنوان الفرعي العلوي (AR)' : 'Top Kicker Label (AR)'}
                </span>
                <input
                  type="text"
                  value={kickerAr}
                  onChange={(e) => setKickerAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'شارة البطاقة (EN)' : 'Side Badge (EN)'}
                </span>
                <input
                  type="text"
                  value={badgeEn}
                  onChange={(e) => setBadgeEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'شارة البطاقة (AR)' : 'Side Badge (AR)'}
                </span>
                <input
                  type="text"
                  value={badgeAr}
                  onChange={(e) => setBadgeAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الوصف (EN)' : 'Description (EN)'}
                </span>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الوصف (AR)' : 'Description (AR)'}
                </span>
                <textarea
                  rows={2}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Pickup Mode & Turnaround Boxes */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2">
              {language === 'ar'
                ? '٢. خانة طريقة الاستلام ومدة التنفيذ (Pickup Mode & Turnaround)'
                : '2. Pickup Mode & Turnaround Summary'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                <span className="font-mono-tabular font-bold text-red-600 dark:text-red-400 block">
                  {language === 'ar' ? 'مربع الاستلام الأول' : 'Box 1 · Pickup Mode'}
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Label (EN)
                    </span>
                    <input
                      type="text"
                      value={pickupModeLabelEn}
                      onChange={(e) => setPickupModeLabelEn(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Label (AR)
                    </span>
                    <input
                      type="text"
                      value={pickupModeLabelAr}
                      onChange={(e) => setPickupModeLabelAr(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Value (EN)
                    </span>
                    <input
                      type="text"
                      value={pickupModeEn}
                      onChange={(e) => setPickupModeEn(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-bold"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Value (AR)
                    </span>
                    <input
                      type="text"
                      value={pickupModeAr}
                      onChange={(e) => setPickupModeAr(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-bold"
                    />
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                <span className="font-mono-tabular font-bold text-red-600 dark:text-red-400 block">
                  {language === 'ar' ? 'مربع التنفيذ الثاني' : 'Box 2 · Turnaround'}
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Label (EN)
                    </span>
                    <input
                      type="text"
                      value={turnaroundLabelEn}
                      onChange={(e) => setTurnaroundLabelEn(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Label (AR)
                    </span>
                    <input
                      type="text"
                      value={turnaroundLabelAr}
                      onChange={(e) => setTurnaroundLabelAr(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Value (EN)
                    </span>
                    <input
                      type="text"
                      value={turnaroundEn}
                      onChange={(e) => setTurnaroundEn(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-bold"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Value (AR)
                    </span>
                    <input
                      type="text"
                      value={turnaroundAr}
                      onChange={(e) => setTurnaroundAr(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-bold"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Maintenance Types */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white">
                {language === 'ar'
                  ? '٣. اختيارات نوع الصيانة (Select Maintenance Type)'
                  : '3. Select Maintenance Type Options'}
              </h3>
              <span className="font-mono-tabular text-[11px] text-zinc-500">
                {maintenanceTypes.length} {language === 'ar' ? 'خيارات' : 'options'}
              </span>
            </div>

            <div className="space-y-2">
              {maintenanceTypes.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
                >
                  <span className="sm:col-span-1 font-mono-tabular font-bold text-zinc-400 text-center">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.en}
                    onChange={(e) => updateListItem(setMaintenanceTypes, item.id, 'en', e.target.value)}
                    placeholder="English label"
                    className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  />
                  <input
                    type="text"
                    value={item.ar}
                    onChange={(e) => updateListItem(setMaintenanceTypes, item.id, 'ar', e.target.value)}
                    placeholder="التسمية بالعربي"
                    className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(setMaintenanceTypes, item.id, 1)}
                    disabled={maintenanceTypes.length <= 1}
                    className="sm:col-span-1 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <input
                type="text"
                value={newTypeEn}
                onChange={(e) => setNewTypeEn(e.target.value)}
                placeholder={language === 'ar' ? 'إضافة نوع صيانة (EN)' : 'New maintenance type (EN)'}
                className="sm:col-span-5 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white"
              />
              <input
                type="text"
                value={newTypeAr}
                onChange={(e) => setNewTypeAr(e.target.value)}
                placeholder={language === 'ar' ? 'إضافة نوع صيانة (AR)' : 'New maintenance type (AR)'}
                className="sm:col-span-5 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  addListItem(
                    setMaintenanceTypes,
                    newTypeEn,
                    newTypeAr,
                    setNewTypeEn,
                    setNewTypeAr,
                    'mt',
                  )
                }
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>

          {/* Section 4: Bike Models + Allow Custom */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white">
                {language === 'ar'
                  ? '٤. موديلات الدراجات المتاحة (Select Bike Model)'
                  : '4. Select Bike Model Options'}
              </h3>

              <label className="inline-flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowCustomBike}
                  onChange={(e) => setAllowCustomBike(e.target.checked)}
                  className="accent-red-600 w-4 h-4"
                />
                <span>
                  {language === 'ar'
                    ? 'السماح بإدخال دراجة أخرى مخصصة'
                    : 'Allow "Other / Custom Bike" input'}
                </span>
              </label>
            </div>

            <div className="space-y-2">
              {bikeModels.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
                >
                  <span className="sm:col-span-1 font-mono-tabular font-bold text-zinc-400 text-center">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.en}
                    onChange={(e) => updateListItem(setBikeModels, item.id, 'en', e.target.value)}
                    placeholder="Bike model (EN)"
                    className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  />
                  <input
                    type="text"
                    value={item.ar}
                    onChange={(e) => updateListItem(setBikeModels, item.id, 'ar', e.target.value)}
                    placeholder="موديل الدراجة (AR)"
                    className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(setBikeModels, item.id, 1)}
                    disabled={bikeModels.length <= 1}
                    className="sm:col-span-1 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <input
                type="text"
                value={newBikeEn}
                onChange={(e) => setNewBikeEn(e.target.value)}
                placeholder={language === 'ar' ? 'إضافة موديل دراجة (EN)' : 'New bike model (EN)'}
                className="sm:col-span-5 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white"
              />
              <input
                type="text"
                value={newBikeAr}
                onChange={(e) => setNewBikeAr(e.target.value)}
                placeholder={language === 'ar' ? 'إضافة موديل دراجة (AR)' : 'New bike model (AR)'}
                className="sm:col-span-5 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  addListItem(
                    setBikeModels,
                    newBikeEn,
                    newBikeAr,
                    setNewBikeEn,
                    setNewBikeAr,
                    'bm',
                  )
                }
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>

          {/* Section 5: Frame Materials */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white">
                {language === 'ar'
                  ? '٥. خامات الهيكل المتاحة (Frame Material)'
                  : '5. Frame Material Options'}
              </h3>
              <span className="font-mono-tabular text-[11px] text-zinc-500">
                {frameMaterials.length} {language === 'ar' ? 'خيارات' : 'options'}
              </span>
            </div>

            <div className="space-y-2">
              {frameMaterials.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
                >
                  <span className="sm:col-span-1 font-mono-tabular font-bold text-zinc-400 text-center">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.en}
                    onChange={(e) => updateListItem(setFrameMaterials, item.id, 'en', e.target.value)}
                    placeholder="Frame material (EN)"
                    className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  />
                  <input
                    type="text"
                    value={item.ar}
                    onChange={(e) => updateListItem(setFrameMaterials, item.id, 'ar', e.target.value)}
                    placeholder="خامة الهيكل (AR)"
                    className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(setFrameMaterials, item.id, 1)}
                    disabled={frameMaterials.length <= 1}
                    className="sm:col-span-1 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <input
                type="text"
                value={newFrameEn}
                onChange={(e) => setNewFrameEn(e.target.value)}
                placeholder={language === 'ar' ? 'إضافة خامة هيكل (EN)' : 'New frame material (EN)'}
                className="sm:col-span-5 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white"
              />
              <input
                type="text"
                value={newFrameAr}
                onChange={(e) => setNewFrameAr(e.target.value)}
                placeholder={language === 'ar' ? 'إضافة خامة هيكل (AR)' : 'New frame material (AR)'}
                className="sm:col-span-5 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  addListItem(
                    setFrameMaterials,
                    newFrameEn,
                    newFrameAr,
                    setNewFrameEn,
                    setNewFrameAr,
                    'fm',
                  )
                }
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>

          {/* Section 6: Highlights Bullets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white">
                {language === 'ar'
                  ? '٦. مميزات الخدمة المعروضة (Service Highlights)'
                  : '6. Service Highlights'}
              </h3>
              <span className="font-mono-tabular text-[11px] text-zinc-500">
                {highlights.length} {language === 'ar' ? 'نقاط' : 'items'}
              </span>
            </div>

            <div className="space-y-2">
              {highlights.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
                >
                  <span className="sm:col-span-1 font-mono-tabular font-bold text-zinc-400 text-center">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.en}
                    onChange={(e) => updateListItem(setHighlights, item.id, 'en', e.target.value)}
                    placeholder="Highlight (EN)"
                    className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  />
                  <input
                    type="text"
                    value={item.ar}
                    onChange={(e) => updateListItem(setHighlights, item.id, 'ar', e.target.value)}
                    placeholder="ميزة الخدمة (AR)"
                    className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(setHighlights, item.id, 1)}
                    disabled={highlights.length <= 1}
                    className="sm:col-span-1 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <input
                type="text"
                value={newHighlightEn}
                onChange={(e) => setNewHighlightEn(e.target.value)}
                placeholder={language === 'ar' ? 'إضافة ميزة جديدة (EN)' : 'New highlight (EN)'}
                className="sm:col-span-5 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white"
              />
              <input
                type="text"
                value={newHighlightAr}
                onChange={(e) => setNewHighlightAr(e.target.value)}
                placeholder={language === 'ar' ? 'إضافة ميزة جديدة (AR)' : 'New highlight (AR)'}
                className="sm:col-span-5 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  addListItem(
                    setHighlights,
                    newHighlightEn,
                    newHighlightAr,
                    setNewHighlightEn,
                    setNewHighlightAr,
                    'hl',
                  )
                }
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>

          {/* Section 7: Gallery Images */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2">
              {language === 'ar' ? '٧. صور معرض الخدمة' : '7. Service Studio Gallery Images'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-[4/3] bg-zinc-100 dark:bg-zinc-900"
                >
                  <img src={asset(img)} alt="" className="w-full h-full object-cover" />
                  {galleryImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setGalleryImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="absolute top-2 end-2 w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-sm cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex-1 min-w-[200px] flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder={language === 'ar' ? 'أضف رابط صورة...' : 'Paste image URL...'}
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إضافة رابط' : 'Add URL'}</span>
                </button>
              </div>

              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 font-bold hover:border-red-600 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-red-600" />
                <span>{language === 'ar' ? 'رفع صورة' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
              </label>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {STUDIO_IMAGE_PRESETS.map((preset) => {
                const selected = galleryImages.includes(preset.url);
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => togglePresetImage(preset.url)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                      selected
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-950'
                    }`}
                  >
                    {language === 'ar' ? preset.labelAr : preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold cursor-pointer"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              {language === 'ar'
                ? 'حفظ تعديلات صفحة الصيانة'
                : 'Save Maintenance Service'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
