import { X } from 'lucide-react';
import { AdminHeader } from './components/AdminHeader';
import { MaintenanceTab } from './components/MaintenanceTab';
import { OrdersTab } from './components/OrdersTab';
import { PastOrdersTab } from './components/PastOrdersTab';
import { ProductsTab } from './components/ProductsTab';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminGate } from './components/AdminGate';

function AdminWorkspace() {
  const { activeTab, setActiveTab, lastNotice, clearNotice, language, dataError } = useAdmin();

  const renderTab = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTab />;
      case 'products':
        return <ProductsTab />;
      case 'maintenance':
        return <MaintenanceTab />;
      case 'past-orders':
        return <PastOrdersTab />;
      default:
        return <OrdersTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      <AdminHeader />

      {dataError && (
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pt-6">
          <div className="rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-xs font-semibold">
            {language === 'ar'
              ? 'تعذر تحميل البيانات. تحقق من الاتصال وقواعد Firestore ثم أعد تحميل الصفحة.'
              : 'Could not load live data. Check your connection and Firestore rules, then reload.'}
          </div>
        </div>
      )}

      {lastNotice && (
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pt-6">
          <div className="rounded-xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-zinc-900 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {lastNotice.text}
            </span>
            <div className="flex items-center gap-3">
              {lastNotice.actionTab && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(lastNotice.actionTab!);
                    clearNotice();
                  }}
                  className="font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                >
                  {language === 'ar' ? 'عرض في الطلبات السابقة' : 'Open Past Orders'}
                </button>
              )}
              <button
                type="button"
                onClick={clearNotice}
                aria-label="Dismiss notice"
                className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {renderTab()}
      </main>

      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
            {language === 'ar' ? 'لوحة تحكم جيك ستور المستقلة' : 'Jeek Store · Admin Panel'}
          </span>
          <span className="font-mono-tabular">© 2026 Jeek Store</span>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 text-center">
          <span dir="ltr" className="font-mono-tabular text-[11px] text-zinc-500 dark:text-zinc-400">
            developed by IntelligentEra . Ahmed Mohamed
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AdminGate>
      <AdminProvider>
        <AdminWorkspace />
      </AdminProvider>
    </AdminGate>
  );
}
