import { asset } from '../lib/asset';
import {
  Archive,
  Bike,
  LogOut,
  Moon,
  Package,
  Sun,
  Wrench,
} from 'lucide-react';
import { AdminTab, useAdmin } from '../context/AdminContext';
import { STORE_LOGO } from '../data/catalog';

export function AdminHeader() {
  const {
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    activeTab,
    setActiveTab,
    orders,
    products,
    maintenanceOrders,
    signOut,
  } = useAdmin();

  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered').length;
  const activeMaintCount = maintenanceOrders.filter((m) => m.status !== 'Delivered').length;
  const pastCount =
    orders.filter((o) => o.status === 'Delivered').length +
    maintenanceOrders.filter((m) => m.status === 'Delivered').length;

  const tabs: {
    id: AdminTab;
    labelEn: string;
    labelAr: string;
    count: number;
    icon: typeof Package;
  }[] = [
    { id: 'orders', labelEn: 'Orders', labelAr: 'الطلبات', count: activeOrdersCount, icon: Package },
    { id: 'products', labelEn: 'Your Products', labelAr: 'منتجاتك', count: products.length, icon: Bike },
    { id: 'maintenance', labelEn: 'Maintenance Orders', labelAr: 'طلبات الصيانة', count: activeMaintCount, icon: Wrench },
    { id: 'past-orders', labelEn: 'Past Orders', labelAr: 'الطلبات السابقة', count: pastCount, icon: Archive },
  ];

  return (
    <header className="w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors duration-200">
      {/* Top 3-Zone Brand & Controls Strip */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-5 grid grid-cols-3 items-start">
        {/* Top Left: EN / AR Switch */}
        <div className="flex items-center justify-start pt-1.5">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Switch language between English and Arabic"
            className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-0.5 text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:border-zinc-400 dark:hover:border-zinc-600"
          >
            <span
              className={`px-2.5 py-1 rounded-md transition-colors ${
                language === 'en'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              EN
            </span>
            <span
              className={`px-2.5 py-1 rounded-md transition-colors ${
                language === 'ar'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              AR
            </span>
          </button>
        </div>

        {/* Top Center: Circular Logo + Inclined Two-Tone "Admin Panel" */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-zinc-950 via-red-600 to-zinc-950 dark:from-white dark:via-red-500 dark:to-white shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                <img
                  src={asset(STORE_LOGO)}
                  alt="Jeek Store Admin Panel"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
            </div>
            <span className="inline-block px-1.5 py-0.5 leading-none font-syne text-xl sm:text-2xl font-extrabold tracking-tight jeek-split-store whitespace-nowrap shrink-0">
              {language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
            </span>
          </div>
        </div>

        {/* Top Right: Light/Dark Switch */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white text-xs font-semibold hover:border-zinc-950 dark:hover:border-zinc-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">{language === 'ar' ? 'فاتح' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden sm:inline">{language === 'ar' ? 'داكن' : 'Dark'}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white text-xs font-semibold hover:border-red-600 hover:text-red-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Sign out'}</span>
          </button>
        </div>
      </div>

      {/* 4 Admin Panel Workspace Tabs */}
      <div className="border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/70 dark:bg-zinc-950">
        <nav
          aria-label="Admin panel sections"
          className="max-w-[1400px] mx-auto px-4 sm:px-8 flex items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto py-2.5"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-red-600 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-400 dark:text-white' : ''}`} />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
                <span
                  className={`font-mono-tabular text-[11px] font-semibold ${
                    isActive ? 'text-zinc-300 dark:text-red-100' : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  · {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
