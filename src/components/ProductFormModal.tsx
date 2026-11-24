import { asset } from '../lib/asset';
import { useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { STUDIO_IMAGE_PRESETS } from '../data/maintenance';
import { CategoryId, Product, ProductColor } from '../types';
import { useAdmin } from '../context/AdminContext';

interface ProductFormModalProps {
  initialProduct: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ELEMENT_DEFAULTS: Record<
  Product['elementKey'],
  { en: string; ar: string }
> = {
  carbon: { en: 'T800 Carbon Fiber', ar: 'ألياف كربون T800' },
  aluminum: { en: '6061 Hydroformed Aluminum', ar: 'ألومنيوم 6061 مُشكّل هيدروليكياً' },
  chromoly: { en: '4130 Chromoly Steel', ar: 'صلب كرومولي 4130' },
  iron: { en: 'High-Tensile Iron Alloy', ar: 'سبيكة حديد عالي الصلابة' },
  gear: { en: 'CNC 7075-T6 Alloy & Polymer', ar: 'ألومنيوم 7075 وبوليمر مقوى' },
};

const QUICK_SIZES = ['S', 'M', 'L', 'XL', 'One Size', 'Universal'];
const TERRAIN_OPTIONS = ['city', 'tarmac', 'trail', 'park', 'mixed'];

export function ProductFormModal({
  initialProduct,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const { language } = useAdmin();
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || '');
  const [nameAr, setNameAr] = useState(initialProduct?.nameAr || '');
  const [category, setCategory] = useState<CategoryId>(initialProduct?.category || 'bikes');
  const [subCategory, setSubCategory] = useState(initialProduct?.subCategory || 'Street Road');
  const [subCategoryAr, setSubCategoryAr] = useState(
    initialProduct?.subCategoryAr || 'طريق حضرية',
  );
  const [price, setPrice] = useState<number>(initialProduct?.price || 990);
  const [rating, setRating] = useState<number>(initialProduct?.rating || 4.8);
  const [isTopSale, setIsTopSale] = useState<boolean>(Boolean(initialProduct?.isTopSale));

  const [elementKey, setElementKey] = useState<Product['elementKey']>(
    initialProduct?.elementKey || 'aluminum',
  );
  const [element, setElement] = useState(
    initialProduct?.element || ELEMENT_DEFAULTS.aluminum.en,
  );
  const [elementAr, setElementAr] = useState(
    initialProduct?.elementAr || ELEMENT_DEFAULTS.aluminum.ar,
  );
  const [weightKg, setWeightKg] = useState<number>(initialProduct?.weightKg || 10.2);
  const [wheelSize, setWheelSize] = useState(initialProduct?.wheelSize || '700c');
  const [drivetrain, setDrivetrain] = useState(
    initialProduct?.drivetrain || 'Shimano Deore 1x11',
  );
  const [drivetrainAr, setDrivetrainAr] = useState(
    initialProduct?.drivetrainAr || 'شيمانو ديور ١×١١ سرعة',
  );
  const [brakes, setBrakes] = useState(initialProduct?.brakes || 'Hydraulic 160mm Disc');
  const [brakesAr, setBrakesAr] = useState(
    initialProduct?.brakesAr || 'فرامل قرصية هيدروليك ١٦٠ مم',
  );
  const [fork, setFork] = useState(initialProduct?.fork || 'Carbon / Alloy Tapered Fork');
  const [forkAr, setForkAr] = useState(initialProduct?.forkAr || 'شوكة كربون / ألومنيوم');

  const [headAngle, setHeadAngle] = useState(initialProduct?.geometry?.headAngle || '72.0°');
  const [reach, setReach] = useState(initialProduct?.geometry?.reach || '395 mm');
  const [stack, setStack] = useState(initialProduct?.geometry?.stack || '555 mm');
  const [wheelbase, setWheelbase] = useState(initialProduct?.geometry?.wheelbase || '1012 mm');

  const [sizes, setSizes] = useState<string[]>(initialProduct?.sizes || ['S', 'M', 'L']);
  const [customSize, setCustomSize] = useState('');

  const [colors, setColors] = useState<ProductColor[]>(
    initialProduct?.colors || [
      { name: 'Crimson Red', nameAr: 'أحمر قرمزي', hex: '#DC2626' },
      { name: 'Jet Black', nameAr: 'أسود نفاث', hex: '#09090B' },
    ],
  );
  const [newColorName, setNewColorName] = useState('');
  const [newColorNameAr, setNewColorNameAr] = useState('');
  const [newColorHex, setNewColorHex] = useState('#DC2626');

  const [image, setImage] = useState(
    initialProduct?.image || STUDIO_IMAGE_PRESETS[0].url,
  );
  const [description, setDescription] = useState(
    initialProduct?.description || '',
  );
  const [descriptionAr, setDescriptionAr] = useState(
    initialProduct?.descriptionAr || '',
  );
  const [highlightsText, setHighlightsText] = useState(
    (initialProduct?.highlights || ['Precision frame build with sealed bearings']).join('\n'),
  );
  const [highlightsArText, setHighlightsArText] = useState(
    (initialProduct?.highlightsAr || ['هيكل دقيق مع رمان بلي مغلق']).join('\n'),
  );

  const [terrains, setTerrains] = useState<string[]>(
    initialProduct?.fitProfile?.terrains || ['city', 'mixed'],
  );
  const [stance, setStance] = useState<'aero' | 'balanced' | 'upright'>(
    initialProduct?.fitProfile?.stance || 'balanced',
  );
  const [budgetTier, setBudgetTier] = useState<'entry' | 'mid' | 'pro'>(
    initialProduct?.fitProfile?.budgetTier || 'mid',
  );

  const handleElementKeyChange = (nextKey: Product['elementKey']) => {
    setElementKey(nextKey);
    setElement(ELEMENT_DEFAULTS[nextKey].en);
    setElementAr(ELEMENT_DEFAULTS[nextKey].ar);
  };

  const toggleSizeChip = (sz: string) => {
    setSizes((prev) =>
      prev.includes(sz) ? prev.filter((item) => item !== sz) : [...prev, sz],
    );
  };

  const addCustomSize = () => {
    const trimmed = customSize.trim();
    if (!trimmed || sizes.includes(trimmed)) return;
    setSizes((prev) => [...prev, trimmed]);
    setCustomSize('');
  };

  const addColorEntry = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [
      ...prev,
      {
        name: newColorName.trim(),
        nameAr: newColorNameAr.trim() || newColorName.trim(),
        hex: newColorHex,
      },
    ]);
    setNewColorName('');
    setNewColorNameAr('');
  };

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
    const safeName = name.trim() || 'Jeek Custom Build';
    const safeSizes = sizes.length > 0 ? sizes : ['M'];
    const safeColors =
      colors.length > 0
        ? colors
        : [{ name: 'Crimson Red', nameAr: 'أحمر قرمزي', hex: '#DC2626' }];

    const productPayload: Product = {
      id:
        initialProduct?.id ||
        `jeek-${safeName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-7)}`,
      name: safeName,
      nameAr: nameAr.trim() || safeName,
      category,
      subCategory: subCategory.trim() || 'Custom Drop',
      subCategoryAr: subCategoryAr.trim() || subCategory.trim() || 'إصدار خاص',
      price: Number(price) || 0,
      element: element.trim() || ELEMENT_DEFAULTS[elementKey].en,
      elementAr: elementAr.trim() || ELEMENT_DEFAULTS[elementKey].ar,
      elementKey,
      sizes: safeSizes,
      wheelSize: wheelSize.trim() || 'Universal',
      weightKg: Number(weightKg) || 1,
      drivetrain: drivetrain.trim() || 'N/A',
      drivetrainAr: drivetrainAr.trim() || drivetrain.trim() || 'غير منطبق',
      brakes: brakes.trim() || 'N/A',
      brakesAr: brakesAr.trim() || brakes.trim() || 'غير منطبق',
      fork: fork.trim() || 'N/A',
      forkAr: forkAr.trim() || fork.trim() || 'غير منطبق',
      colors: safeColors,
      image: image.trim() || STUDIO_IMAGE_PRESETS[0].url,
      isTopSale,
      rating: Math.min(5, Math.max(1, Number(rating) || 4.8)),
      description:
        description.trim() ||
        `${safeName} engineered with ${element.trim()} for street and endurance riding.`,
      descriptionAr:
        descriptionAr.trim() ||
        `${nameAr.trim() || safeName} بتصميم جيك ستور من ${elementAr.trim()}.`,
      highlights: highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      highlightsAr: highlightsArText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      geometry:
        category === 'bikes'
          ? {
              headAngle: headAngle.trim() || '72.0°',
              reach: reach.trim() || '395 mm',
              stack: stack.trim() || '555 mm',
              wheelbase: wheelbase.trim() || '1012 mm',
            }
          : undefined,
      reviews: initialProduct?.reviews || [],
      fitProfile:
        category === 'bikes'
          ? {
              terrains: terrains.length > 0 ? terrains : ['city'],
              stance,
              budgetTier,
            }
          : undefined,
    };

    onSave(productPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
          <div>
            <span className="text-[11px] font-mono-tabular font-bold text-red-600">
              {isEditing
                ? language === 'ar'
                  ? 'تعديل منتج'
                  : 'EDIT STORE ITEM'
                : language === 'ar'
                  ? 'إضافة منتج جديد'
                  : 'NEW STORE ITEM'}
            </span>
            <h2 className="font-display text-xl font-extrabold text-zinc-950 dark:text-white">
              {isEditing
                ? language === 'ar'
                  ? initialProduct?.nameAr
                  : initialProduct?.name
                : language === 'ar'
                  ? 'أضف منتجاً بكل المواصفات'
                  : 'Add Product with Full Specifications'}
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

        {/* Scrollable Full Spec Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 1. Core Identity */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
              {language === 'ar' ? '١. الهوية والسعر' : '1. Identity, Category & Pricing'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'اسم المنتج (إنجليزي) *' : 'Product Name (EN) *'}
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jeek Apex Carbon R2"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'اسم المنتج (عربي)' : 'Product Name (AR)'}
                </span>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="جيك أبيكس كربون R2"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'القسم' : 'Category'}
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                >
                  <option value="bikes">{language === 'ar' ? 'دراجات' : 'Bikes'}</option>
                  <option value="accessories">{language === 'ar' ? 'إكسسوارات' : 'Accessories'}</option>
                  <option value="spare-parts">{language === 'ar' ? 'قطع غيار' : 'Spare Parts'}</option>
                  <option value="safety">{language === 'ar' ? 'معدات أمان' : 'Safety Equipment'}</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'النوع الفرعي (EN)' : 'Sub-Category (EN)'}
                </span>
                <input
                  type="text"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  placeholder="Aero Road / Hardtail MTB"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'النوع الفرعي (AR)' : 'Sub-Category (AR)'}
                </span>
                <input
                  type="text"
                  value={subCategoryAr}
                  onChange={(e) => setSubCategoryAr(e.target.value)}
                  placeholder="طريق انسيابية"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {language === 'ar' ? 'السعر (ج.م)' : 'Price (EGP)'}
                  </span>
                  <input
                    type="number"
                    min={1}
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {language === 'ar' ? 'التقييم' : 'Rating'}
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                  />
                </label>
              </div>
            </div>

            <label className="inline-flex items-center gap-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isTopSale}
                onChange={(e) => setIsTopSale(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              <span>
                {language === 'ar'
                  ? 'عرض المنتج في قسم الأكثر مبيعاً بالصفحة الرئيسية'
                  : 'Feature in Top Sales showcase on Storefront Home'}
              </span>
            </label>
          </div>

          {/* 2. Frame Material & Mechanical Specs */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
              {language === 'ar' ? '٢. الخامة والمواصفات الفنية' : '2. Element & Mechanical Specs'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'فئة الخامة' : 'Element Family'}
                </span>
                <select
                  value={elementKey}
                  onChange={(e) =>
                    handleElementKeyChange(e.target.value as Product['elementKey'])
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                >
                  <option value="carbon">Carbon Fiber</option>
                  <option value="aluminum">Aluminum Alloy</option>
                  <option value="chromoly">4130 Chromoly Steel</option>
                  <option value="iron">High-Tensile Iron</option>
                  <option value="gear">Gear / Composite</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'اسم الخامة (EN)' : 'Element Label (EN)'}
                </span>
                <input
                  type="text"
                  value={element}
                  onChange={(e) => setElement(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'اسم الخامة (AR)' : 'Element Label (AR)'}
                </span>
                <input
                  type="text"
                  value={elementAr}
                  onChange={(e) => setElementAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}
                </span>
                <input
                  type="number"
                  step="0.1"
                  min={0.05}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'مقاس العجلة' : 'Wheel Size'}
                </span>
                <input
                  type="text"
                  value={wheelSize}
                  onChange={(e) => setWheelSize(e.target.value)}
                  placeholder='700c / 29" / 27.5" / Universal'
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'ناقل الحركة (EN)' : 'Drivetrain (EN)'}
                </span>
                <input
                  type="text"
                  value={drivetrain}
                  onChange={(e) => setDrivetrain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'ناقل الحركة (AR)' : 'Drivetrain (AR)'}
                </span>
                <input
                  type="text"
                  value={drivetrainAr}
                  onChange={(e) => setDrivetrainAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الفرامل (EN)' : 'Brakes (EN)'}
                </span>
                <input
                  type="text"
                  value={brakes}
                  onChange={(e) => setBrakes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الفرامل (AR)' : 'Brakes (AR)'}
                </span>
                <input
                  type="text"
                  value={brakesAr}
                  onChange={(e) => setBrakesAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الشوكة / المساعد (EN)' : 'Fork / Suspension (EN)'}
                </span>
                <input
                  type="text"
                  value={fork}
                  onChange={(e) => setFork(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الشوكة / المساعد (AR)' : 'Fork / Suspension (AR)'}
                </span>
                <input
                  type="text"
                  value={forkAr}
                  onChange={(e) => setForkAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>
            </div>
          </div>

          {/* 3. Geometry & Perfect Bike Fit (when Bikes) */}
          {category === 'bikes' && (
            <div className="space-y-4">
              <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
                {language === 'ar' ? '٣. هندسة الهيكل والتوافق' : '3. Frame Geometry & Fit Matcher'}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Head Angle</span>
                  <input
                    type="text"
                    value={headAngle}
                    onChange={(e) => setHeadAngle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Reach</span>
                  <input
                    type="text"
                    value={reach}
                    onChange={(e) => setReach(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Stack</span>
                  <input
                    type="text"
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Wheelbase</span>
                  <input
                    type="text"
                    value={wheelbase}
                    onChange={(e) => setWheelbase(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
                <div className="space-y-1.5">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                    {language === 'ar' ? 'المسارات المناسبة' : 'Ideal Terrains'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TERRAIN_OPTIONS.map((tr) => {
                      const active = terrains.includes(tr);
                      return (
                        <button
                          key={tr}
                          type="button"
                          onClick={() =>
                            setTerrains((prev) =>
                              prev.includes(tr) ? prev.filter((x) => x !== tr) : [...prev, tr],
                            )
                          }
                          className={`px-2.5 py-1 rounded-md border text-[11px] font-bold cursor-pointer ${
                            active
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          {tr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {language === 'ar' ? 'وضعية القيادة' : 'Riding Stance'}
                  </span>
                  <select
                    value={stance}
                    onChange={(e) => setStance(e.target.value as 'aero' | 'balanced' | 'upright')}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  >
                    <option value="aero">Aero Tuck</option>
                    <option value="balanced">Balanced</option>
                    <option value="upright">Upright</option>
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {language === 'ar' ? 'الفئة السعرية' : 'Budget Tier'}
                  </span>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value as 'entry' | 'mid' | 'pro')}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  >
                    <option value="entry">Street Essential</option>
                    <option value="mid">Performance Alloy</option>
                    <option value="pro">Pro Flagship</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {/* 4. Sizes & Colorways */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
                {language === 'ar' ? '٤. المقاسات المتاحة' : '4. Available Sizes'}
              </h3>

              <div className="flex flex-wrap gap-2">
                {QUICK_SIZES.map((sz) => {
                  const active = sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSizeChip(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono-tabular font-bold border cursor-pointer ${
                        active
                          ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950'
                          : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
                {sizes
                  .filter((sz) => !QUICK_SIZES.includes(sz))
                  .map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSizeChip(sz)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono-tabular font-bold border bg-red-600 text-white border-red-600 cursor-pointer"
                    >
                      {sz} ×
                    </button>
                  ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder={language === 'ar' ? 'إضافة مقاس مخصص...' : 'Add custom size (e.g. 54cm)...'}
                  className="flex-1 px-3 py-2 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addCustomSize}
                  className="px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:border-red-600 cursor-pointer"
                >
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
                {language === 'ar' ? '٥. الألوان المتاحة' : '5. Available Colorways'}
              </h3>

              <div className="flex flex-wrap gap-2">
                {colors.map((c, idx) => (
                  <div
                    key={`${c.name}-${idx}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-600"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="font-semibold text-zinc-950 dark:text-white">
                      {language === 'ar' ? c.nameAr : c.name}
                    </span>
                    {colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setColors((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-zinc-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder={language === 'ar' ? 'اسم اللون (EN)' : 'Color Name (EN)'}
                  className="flex-1 min-w-[110px] px-3 py-2 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
                <input
                  type="text"
                  value={newColorNameAr}
                  onChange={(e) => setNewColorNameAr(e.target.value)}
                  placeholder={language === 'ar' ? 'اسم اللون (AR)' : 'Color Name (AR)'}
                  className="flex-1 min-w-[110px] px-3 py-2 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addColorEntry}
                  className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:border-red-600 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'لون' : 'Add'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Media, Descriptions & Highlights */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-extrabold text-zinc-950 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
              {language === 'ar' ? '٦. الصورة والوصف والمميزات' : '6. Studio Image, Description & Highlights'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={asset(image)}
                  alt={name || 'Product preview'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-8 space-y-3 text-xs">
                <label className="space-y-1 block">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {language === 'ar' ? 'اختر صورة استوديو جاهزة' : 'Choose Jeek Studio Photo'}
                  </span>
                  <select
                    value={
                      STUDIO_IMAGE_PRESETS.some((p) => p.url === image) ? image : 'custom'
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'custom') setImage(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                  >
                    {STUDIO_IMAGE_PRESETS.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {language === 'ar' ? preset.labelAr : preset.label}
                      </option>
                    ))}
                    <option value="custom">Custom / Uploaded Photo</option>
                  </select>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="/src/assets/images/..."
                    className="flex-1 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-mono-tabular"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 font-bold text-zinc-900 dark:text-white hover:border-red-600 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-red-600" />
                    <span>{language === 'ar' ? 'رفع صورة' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الوصف (EN)' : 'Full Description (EN)'}
                </span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed build engineering and ride feel..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'الوصف (AR)' : 'Full Description (AR)'}
                </span>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="وصف هندسي كامل وتفاصيل الأداء..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'أبرز المميزات (سطر لكل ميزة - EN)' : 'Key Highlights (one per line - EN)'}
                </span>
                <textarea
                  rows={3}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {language === 'ar' ? 'أبرز المميزات (سطر لكل ميزة - AR)' : 'Key Highlights (one per line - AR)'}
                </span>
                <textarea
                  rows={3}
                  value={highlightsArText}
                  onChange={(e) => setHighlightsArText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
                />
              </label>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-950 cursor-pointer"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              {isEditing
                ? language === 'ar'
                  ? 'حفظ التعديلات'
                  : 'Save Product Changes'
                : language === 'ar'
                  ? 'إضافة المنتج للمتجر'
                  : 'Publish Product to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
