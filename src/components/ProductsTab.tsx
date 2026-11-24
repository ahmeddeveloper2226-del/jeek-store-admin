import { asset } from '../lib/asset';
import { useMemo, useState } from 'react';
import { Edit3, Plus, RotateCcw, Search, Star, Trash2, Wrench } from 'lucide-react';
import { CategoryId, Product } from '../types';
import { useAdmin } from '../context/AdminContext';
import { formatCurrency } from '../data/catalog';
import { ProductFormModal } from './ProductFormModal';
import { MaintenanceConfigModal } from './MaintenanceConfigModal';

export function ProductsTab() {
  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    resetCatalog,
    maintenanceConfig,
    updateMaintenanceConfig,
    resetMaintenanceConfig,
    language,
  } = useAdmin();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | CategoryId>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [maintModalOpen, setMaintModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (catFilter !== 'all' && p.category !== catFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameAr.toLowerCase().includes(q) ||
        p.element.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q)
      );
    });
  }, [products, catFilter, search]);

  const catLabels: { key: 'all' | CategoryId; en: string; ar: string }[] = [
    { key: 'all', en: 'All Items', ar: 'الكل' },
    { key: 'bikes', en: 'Bikes', ar: 'دراجات' },
    { key: 'accessories', en: 'Accessories', ar: 'إكسسوارات' },
    { key: 'spare-parts', en: 'Spare Parts', ar: 'قطع غيار' },
    { key: 'safety', en: 'Safety Gear', ar: 'أمان' },
  ];

  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleSave = (saved: Product) => {
    if (editingProduct) {
      updateProduct(saved);
    } else {
      addProduct(saved);
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div className="space-y-1.5">
          <span className="text-xs font-mono-tabular font-semibold text-red-600 dark:text-red-400">
            {products.length} {language === 'ar' ? 'منتج بالمتجر' : 'STORE ITEMS'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {language === 'ar' ? 'منتجاتك' : 'Your Products'}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            {language === 'ar'
              ? 'أضف منتجات جديدة بكل تفاصيلها أو عدّل أو احذف أي دراجة أو قطعة من المتجر مباشرة.'
              : 'Manage live store inventory—add new bikes or gear with complete specs, edit existing models, or remove items.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={resetCatalog}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-950 dark:hover:border-zinc-500 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'استعادة الافتراضي' : 'Reset Default'}</span>
          </button>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {catLabels.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCatFilter(c.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap cursor-pointer ${
                catFilter === c.key
                  ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-red-600 dark:border-red-600'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-950'
              }`}
            >
              {language === 'ar' ? c.ar : c.en}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث في المنتجات...' : 'Search products or elements...'}
            className="w-full ps-9 pe-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* Product Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const isConfirming = confirmDeleteId === product.id;
          return (
            <article
              key={product.id}
              className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800 overflow-hidden">
                  <img
                    src={asset(product.image)}
                    alt={language === 'ar' ? product.nameAr : product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="truncate">
                      {language === 'ar' ? product.subCategoryAr : product.subCategory}
                      {product.isTopSale
                        ? ` · ${language === 'ar' ? 'الأكثر مبيعاً' : 'Top Sale'}`
                        : ''}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono-tabular font-semibold text-zinc-950 dark:text-white shrink-0">
                      <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      {product.rating}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-lg font-extrabold text-zinc-950 dark:text-white leading-snug">
                      {language === 'ar' ? product.nameAr : product.name}
                    </h2>
                    <span className="font-mono-tabular text-lg font-extrabold text-red-600 dark:text-red-500 shrink-0">
                      {formatCurrency(product.price, language)}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                    <p>
                      <span className="text-zinc-400">{language === 'ar' ? 'الخامة:' : 'Element:'} </span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                        {language === 'ar' ? product.elementAr : product.element}
                      </span>
                    </p>
                    <p className="font-mono-tabular">
                      <span className="text-zinc-400">{language === 'ar' ? 'المقاسات:' : 'Sizes:'} </span>
                      <span>{product.sizes.join(' / ')}</span>
                      <span> · {product.weightKg} kg</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    {product.colors.map((c) => (
                      <span
                        key={c.name}
                        title={language === 'ar' ? c.nameAr : c.name}
                        className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-white inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                </button>

                {isConfirming ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        removeProduct(product.id);
                        setConfirmDeleteId(null);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer"
                    >
                      {language === 'ar' ? 'تأكيد' : 'Confirm'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold cursor-pointer"
                    >
                      {language === 'ar' ? 'لا' : 'No'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(product.id)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'حذف' : 'Remove'}</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Door to Door Maintenance Storefront Card */}
      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-mono-tabular font-bold text-red-600 dark:text-red-400">
              {language === 'ar' ? 'خدمة صيانة المتجر' : 'MAINTENANCE SERVICE PRESENTATION'}
            </span>
            <h3 className="font-display text-base font-extrabold text-zinc-950 dark:text-white truncate">
              {language === 'ar' ? maintenanceConfig.titleAr : maintenanceConfig.titleEn}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {language === 'ar' ? maintenanceConfig.pickupModeAr : maintenanceConfig.pickupModeEn} ·{' '}
              {language === 'ar' ? maintenanceConfig.turnaroundAr : maintenanceConfig.turnaroundEn}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMaintModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-red-600 text-xs font-bold text-zinc-950 dark:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-red-600" />
          <span>{language === 'ar' ? 'تعديل تفاصيل الصيانة' : 'Edit Maintenance Details'}</span>
        </button>
      </div>

      {modalOpen && (
        <ProductFormModal
          initialProduct={editingProduct}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}

      {maintModalOpen && (
        <MaintenanceConfigModal
          initialConfig={maintenanceConfig}
          onClose={() => setMaintModalOpen(false)}
          onSave={(updated) => {
            updateMaintenanceConfig(updated);
            setMaintModalOpen(false);
          }}
          onReset={resetMaintenanceConfig}
        />
      )}
    </div>
  );
}
