// jeek-admin-panel/src/components/ProductFormModal.tsx
import { asset } from '../lib/asset';
import { useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { STUDIO_IMAGE_PRESETS } from '../data/maintenance';
import { BikeType, CategoryId, Product, ProductColor, ProductDetail } from '../types';
import { useAdmin } from '../context/AdminContext';

interface ProductFormModalProps {
  initialProduct: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const BIKE_SUBCATEGORIES: { id: BikeType; en: string; ar: string }[] = [
  { id: 'mountain', en: 'Mountain Bikes', ar: 'دراجات جبلية' },
  { id: 'road', en: 'Road Bikes', ar: 'دراجات طريق' },
  { id: 'hybrid', en: 'Hybrid Bikes', ar: 'دراجات هجينة' },
  { id: 'kids', en: 'Kids Bikes', ar: 'دراجات أطفال' },
];

const ELEMENT_KEY_BY_CATEGORY: Record<CategoryId, Product['elementKey']> = {
  bikes: 'aluminum',
  accessories: 'gear',
  'spare-parts': 'gear',
  safety: 'gear',
};

const DEFAULT_COLORS: ProductColor[] = [
  { name: 'Standard', nameAr: 'قياسي', hex: '#71717A' },
];

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white';

export function ProductFormModal({ initialProduct, onClose, onSave }: ProductFormModalProps) {
  const { language } = useAdmin();
  const ar = language === 'ar';
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || '');
  const [nameAr, setNameAr] = useState(initialProduct?.nameAr || '');
  const [price, setPrice] = useState<string>(
    initialProduct ? String(initialProduct.price) : '',
  );
  const [category, setCategory] = useState<CategoryId>(initialProduct?.category || 'bikes');
  const [bikeType, setBikeType] = useState<BikeType>(initialProduct?.bikeType || 'mountain');
  const [sizeText, setSizeText] = useState(
    initialProduct?.category === 'bikes' ? (initialProduct.sizes || []).join(', ') : '',
  );
  const [details, setDetails] = useState<ProductDetail[]>(initialProduct?.details || []);
  const [image, setImage] = useState(initialProduct?.image || STUDIO_IMAGE_PRESETS[0].url);

  const updateDetail = (idx: number, patch: Partial<ProductDetail>) =>
    setDetails((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  // Uploaded photos are resized + compressed so the product document stays far below Firestore's 1 MB limit.
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const img = new Image();
      img.onload = () => {
        const maxSide = 1000;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeName = name.trim();
    const isBike = category === 'bikes';
    const sub = BIKE_SUBCATEGORIES.find((s) => s.id === bikeType)!;

    const sizes = isBike
      ? sizeText
          .split(/[,،\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const cleanDetails = details
      .map((d) => ({ name: d.name.trim(), value: d.value.trim() }))
      .filter((d) => d.name && d.value);

    // Fields that are no longer edited here keep their existing value (when editing)
    // or get a neutral default, so the storefront keeps working.
    const base: Product = {
      id: '',
      name: '',
      nameAr: '',
      category,
      subCategory: '',
      subCategoryAr: '',
      price: 0,
      element: 'N/A',
      elementAr: 'غير منطبق',
      elementKey: ELEMENT_KEY_BY_CATEGORY[category],
      sizes: ['One Size'],
      wheelSize: 'N/A',
      weightKg: 0,
      drivetrain: 'N/A',
      drivetrainAr: 'غير منطبق',
      brakes: 'N/A',
      brakesAr: 'غير منطبق',
      fork: 'N/A',
      forkAr: 'غير منطبق',
      colors: DEFAULT_COLORS,
      image,
      rating: 4.8,
      description: '',
      descriptionAr: '',
      highlights: [],
      highlightsAr: [],
      reviews: [],
    };

    const payload: Product = {
      ...base,
      ...(initialProduct || {}),
      id:
        initialProduct?.id ||
        `jeek-${safeName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-7)}`,
      name: safeName,
      nameAr: nameAr.trim() || safeName,
      price: Number(price) || 0,
      category,
      subCategory: isBike ? sub.en : '',
      subCategoryAr: isBike ? sub.ar : '',
      sizes: isBike ? (sizes.length > 0 ? sizes : ['One Size']) : ['One Size'],
      image: image.trim() || STUDIO_IMAGE_PRESETS[0].url,
      details: cleanDetails,
    };

    if (isBike) {
      payload.bikeType = bikeType;
    } else {
      delete payload.bikeType;
      delete payload.geometry;
      delete payload.fitProfile;
    }

    onSave(payload);
  };

  const categoryLabel = (c: CategoryId) =>
    c === 'bikes'
      ? ar ? 'دراجات' : 'Bikes'
      : c === 'accessories'
        ? ar ? 'إكسسوارات' : 'Accessories'
        : c === 'spare-parts'
          ? ar ? 'قطع غيار' : 'Spare Parts'
          : ar ? 'معدات أمان' : 'Safety Equipment';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-3xl max-h-[92vh] rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
          <div>
            <span className="text-[11px] font-mono-tabular font-bold text-red-600">
              {isEditing ? (ar ? 'تعديل منتج' : 'EDIT STORE ITEM') : ar ? 'إضافة منتج جديد' : 'NEW STORE ITEM'}
            </span>
            <h2 className="font-display text-xl font-extrabold text-zinc-950 dark:text-white">
              {isEditing
                ? ar ? initialProduct?.nameAr : initialProduct?.name
                : ar ? 'إضافة منتج' : 'Add Product'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product form"
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-red-600 hover:text-red-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Fixed details */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
              {ar ? 'البيانات الأساسية' : 'Main Details'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {ar ? 'اسم المنتج (إنجليزي) *' : 'Product Name (EN) *'}
                </span>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {ar ? 'اسم المنتج (عربي)' : 'Product Name (AR)'}
                </span>
                <input type="text" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={inputCls} />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {ar ? 'السعر (ج.م) *' : 'Price (EGP) *'}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                  className={`${inputCls} font-mono-tabular`}
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {ar ? 'القسم' : 'Category'}
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className={inputCls}
                >
                  {(['bikes', 'accessories', 'spare-parts', 'safety'] as CategoryId[]).map((c) => (
                    <option key={c} value={c}>{categoryLabel(c)}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {ar ? 'القسم الفرعي' : 'Subcategory'}
                </span>
                {category === 'bikes' ? (
                  <select
                    value={bikeType}
                    onChange={(e) => setBikeType(e.target.value as BikeType)}
                    className={inputCls}
                  >
                    {BIKE_SUBCATEGORIES.map((s) => (
                      <option key={s.id} value={s.id}>{ar ? s.ar : s.en}</option>
                    ))}
                  </select>
                ) : (
                  <select disabled value="none" className={`${inputCls} opacity-70`}>
                    <option value="none">{ar ? 'لا يوجد بعد' : 'Not yet'}</option>
                  </select>
                )}
              </label>

              {category === 'bikes' && (
                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {ar ? 'المقاس (افصل بفاصلة)' : 'Size (separate with commas)'}
                  </span>
                  <input
                    type="text"
                    value={sizeText}
                    onChange={(e) => setSizeText(e.target.value)}
                    placeholder="S, M, L"
                    className={inputCls}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Custom details */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
              {ar ? 'تفاصيل إضافية' : 'Additional Details'}
            </h3>

            {details.length === 0 && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {ar
                  ? 'لا توجد تفاصيل إضافية. أضف أي تفصيلة باسمها ومحتواها.'
                  : 'No extra details yet. Add any detail with its own name and content.'}
              </p>
            )}

            {details.map((d, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <input
                  type="text"
                  value={d.name}
                  onChange={(e) => updateDetail(idx, { name: e.target.value })}
                  placeholder={ar ? 'اسم التفصيلة (مثال: الوزن)' : 'Detail name (e.g. Weight)'}
                  className={`${inputCls} flex-1`}
                />
                <input
                  type="text"
                  value={d.value}
                  onChange={(e) => updateDetail(idx, { value: e.target.value })}
                  placeholder={ar ? 'المحتوى (مثال: ١٢ كجم)' : 'Content (e.g. 12 kg)'}
                  className={`${inputCls} flex-[2]`}
                />
                <button
                  type="button"
                  onClick={() => setDetails((prev) => prev.filter((_, i) => i !== idx))}
                  aria-label="Remove detail"
                  className="w-9 h-9 shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-red-600 hover:border-red-600 flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setDetails((prev) => [...prev, { name: '', value: '' }])}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:border-red-600 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{ar ? 'إضافة تفصيلة' : 'Add Detail'}</span>
            </button>
          </div>

          {/* Photo */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
              {ar ? 'صورة المنتج' : 'Product Photo'}
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-32 aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shrink-0">
                <img
                  src={asset(image)}
                  alt={name || 'Product preview'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white hover:border-red-600 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-red-600" />
                <span>{ar ? 'رفع صورة' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-950 cursor-pointer"
            >
              {ar ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              {isEditing ? (ar ? 'حفظ التعديلات' : 'Save Product Changes') : ar ? 'إضافة المنتج للمتجر' : 'Publish Product to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}