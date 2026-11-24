import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { signOut as fbSignOut } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { PRODUCTS } from '../data/catalog';
import { DEFAULT_MAINTENANCE_CONFIG } from '../data/maintenance';
import { auth, db } from '../lib/firebase';
import {
  Language,
  MaintenanceOrder,
  MaintenanceServiceConfig,
  Order,
  OrderStatus,
  Product,
  Theme,
} from '../types';

export type AdminTab = 'orders' | 'products' | 'maintenance' | 'past-orders';

interface AdminContextValue {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  resetCatalog: () => void;
  maintenanceOrders: MaintenanceOrder[];
  addMaintenanceOrder: (order: MaintenanceOrder) => void;
  updateMaintenanceStatus: (orderId: string, status: OrderStatus) => void;
  toggleMaintenanceCheck: (orderId: string, checkId: string) => void;
  updateMaintenanceNotes: (orderId: string, notes: string, technician: string) => void;
  maintenanceConfig: MaintenanceServiceConfig;
  updateMaintenanceConfig: (config: MaintenanceServiceConfig) => void;
  resetMaintenanceConfig: () => void;
  lastNotice: { text: string; actionTab?: AdminTab } | null;
  clearNotice: () => void;
  signOut: () => void;
  dataError: boolean;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function newestFirst<T extends { createdAtMs?: number; date: string }>(list: T[]): T[] {
  return [...list].sort(
    (a, b) => (b.createdAtMs ?? Date.parse(b.date) ?? 0) - (a.createdAtMs ?? Date.parse(a.date) ?? 0),
  );
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [lastNotice, setLastNotice] = useState<{ text: string; actionTab?: AdminTab } | null>(null);
  const [dataError, setDataError] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [maintenanceOrders, setMaintenanceOrders] = useState<MaintenanceOrder[]>([]);
  const [maintenanceConfig, setMaintenanceConfig] =
    useState<MaintenanceServiceConfig>(DEFAULT_MAINTENANCE_CONFIG);
  const seedChecked = useRef(false);

  // Sync Tailwind dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Sync language + RTL direction on <html>
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Live data from Firestore
  useEffect(() => {
    if (!db) return;
    const onErr = () => setDataError(true);

    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snap) => {
        setDataError(false);
        setOrders(newestFirst(snap.docs.map((d) => ({ ...(d.data() as Order), docId: d.id }))));
      },
      onErr,
    );
    const unsubMaint = onSnapshot(
      collection(db, 'maintenanceOrders'),
      (snap) =>
        setMaintenanceOrders(
          newestFirst(snap.docs.map((d) => ({ ...(d.data() as MaintenanceOrder), docId: d.id }))),
        ),
      onErr,
    );
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        const list = snap.docs.map((d) => d.data() as Product);
        list.sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));
        setProducts(list);
        // First ever login: publish the default catalog once.
        if (snap.empty && !seedChecked.current && !snap.metadata.fromCache) {
          seedChecked.current = true;
          void seedDefaults();
        }
      },
      onErr,
    );
    const unsubConfig = onSnapshot(
      doc(db, 'config', 'maintenance'),
      (snap) => {
        if (snap.exists()) {
          setMaintenanceConfig({
            ...DEFAULT_MAINTENANCE_CONFIG,
            ...(snap.data() as Partial<MaintenanceServiceConfig>),
          });
        }
      },
      onErr,
    );
    return () => {
      unsubOrders();
      unsubMaint();
      unsubProducts();
      unsubConfig();
    };
  }, []);

  const seedDefaults = async () => {
    if (!db) return;
    try {
      const metaRef = doc(db, 'config', 'meta');
      if ((await getDoc(metaRef)).exists()) return;
      const batch = writeBatch(db);
      PRODUCTS.forEach((p, i) => batch.set(doc(db!, 'products', p.id), { ...p, sortIndex: i }));
      batch.set(doc(db, 'config', 'maintenance'), DEFAULT_MAINTENANCE_CONFIG);
      batch.set(metaRef, { seeded: true });
      await batch.commit();
    } catch {
      // surfaced through dataError on next snapshot failure
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  const clearNotice = () => setLastNotice(null);
  const showNotice = (text: string, actionTab?: AdminTab) => setLastNotice({ text, actionTab });

  const ar = language === 'ar';

  /** Runs a Firestore write; shows a failure notice, or the success notice if given. */
  const run = (task: Promise<unknown>, success?: { text: string; actionTab?: AdminTab }) => {
    task
      .then(() => {
        if (success) showNotice(success.text, success.actionTab);
      })
      .catch(() => {
        showNotice(
          ar
            ? 'فشل حفظ التغيير. تحقق من الاتصال وصلاحيات الدخول ثم أعد المحاولة.'
            : 'Could not save that change. Check your connection and sign-in, then try again.',
        );
      });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    if (!db) return;
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    run(
      updateDoc(doc(db, 'orders', target.docId || target.id), { status }),
      status === 'Delivered'
        ? {
            text: ar
              ? `تم نقل الطلب #${orderId} إلى الطلبات السابقة.`
              : `Order #${orderId} marked Delivered and moved to Past Orders.`,
            actionTab: 'past-orders',
          }
        : undefined,
    );
  };

  const addProduct = (product: Product) => {
    if (!db) return;
    const minIndex = products.reduce((m, p) => Math.min(m, p.sortIndex ?? 0), 0);
    run(
      setDoc(doc(db, 'products', product.id), { ...product, sortIndex: minIndex - 1 }),
      {
        text: ar
          ? `تمت إضافة "${product.nameAr}" إلى المتجر.`
          : `Added "${product.name}" to your store catalog.`,
      },
    );
  };

  const updateProduct = (product: Product) => {
    if (!db) return;
    const existing = products.find((p) => p.id === product.id);
    run(
      setDoc(doc(db, 'products', product.id), { ...product, sortIndex: existing?.sortIndex ?? 0 }),
      { text: ar ? `تم تحديث تفاصيل "${product.nameAr}".` : `Updated "${product.name}" details.` },
    );
  };

  const removeProduct = (productId: string) => {
    if (!db) return;
    run(deleteDoc(doc(db, 'products', productId)), {
      text: ar ? 'تم حذف المنتج من المتجر.' : 'Product removed from store catalog.',
    });
  };

  const resetCatalog = () => {
    if (!db) return;
    const database = db;
    run(
      (async () => {
        const existing = await getDocs(collection(database, 'products'));
        const batch = writeBatch(database);
        existing.docs.forEach((d) => batch.delete(d.ref));
        PRODUCTS.forEach((p, i) => batch.set(doc(database, 'products', p.id), { ...p, sortIndex: i }));
        await batch.commit();
      })(),
      { text: ar ? 'تمت استعادة قائمة المنتجات الأصلية.' : 'Store catalog restored to default items.' },
    );
  };

  const addMaintenanceOrder = (order: MaintenanceOrder) => {
    if (!db) return;
    const ref = doc(collection(db, 'maintenanceOrders'));
    run(setDoc(ref, { ...order, docId: ref.id, createdAtMs: Date.now() }), {
      text: ar ? `تمت إضافة طلب الصيانة #${order.id}.` : `Maintenance order #${order.id} created.`,
    });
  };

  const maintRef = (orderId: string) => {
    const target = maintenanceOrders.find((m) => m.id === orderId);
    return target && db ? { target, ref: doc(db, 'maintenanceOrders', target.docId || target.id) } : null;
  };

  const updateMaintenanceStatus = (orderId: string, status: OrderStatus) => {
    const found = maintRef(orderId);
    if (!found) return;
    run(
      updateDoc(found.ref, { status }),
      status === 'Delivered'
        ? {
            text: ar
              ? `تم نقل طلب الصيانة #${orderId} إلى الطلبات السابقة.`
              : `Maintenance order #${orderId} marked Delivered and moved to Past Orders.`,
            actionTab: 'past-orders',
          }
        : undefined,
    );
  };

  const toggleMaintenanceCheck = (orderId: string, checkId: string) => {
    const found = maintRef(orderId);
    if (!found) return;
    const checklist = found.target.checklist.map((c) =>
      c.id === checkId ? { ...c, done: !c.done } : c,
    );
    run(updateDoc(found.ref, { checklist }));
  };

  const updateMaintenanceNotes = (orderId: string, notes: string, technician: string) => {
    const found = maintRef(orderId);
    if (!found) return;
    run(updateDoc(found.ref, { technicianNotes: notes, technician }), {
      text: ar ? 'تم حفظ ملاحظات الورشة.' : 'Workshop technician notes saved.',
    });
  };

  const updateMaintenanceConfig = (config: MaintenanceServiceConfig) => {
    if (!db) return;
    run(setDoc(doc(db, 'config', 'maintenance'), config), {
      text: ar
        ? 'تم تحديث تفاصيل خدمة الصيانة بالمتجر بنجاح.'
        : 'Storefront Door to Door Maintenance details updated.',
    });
  };

  const resetMaintenanceConfig = () => {
    if (!db) return;
    run(setDoc(doc(db, 'config', 'maintenance'), DEFAULT_MAINTENANCE_CONFIG), {
      text: ar
        ? 'تمت استعادة تفاصيل الصيانة الافتراضية.'
        : 'Door to Door Maintenance details restored to defaults.',
    });
  };

  const signOut = () => {
    if (auth) void fbSignOut(auth);
  };

  return (
    <AdminContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        activeTab,
        setActiveTab,
        orders,
        updateOrderStatus,
        products,
        addProduct,
        updateProduct,
        removeProduct,
        resetCatalog,
        maintenanceOrders,
        addMaintenanceOrder,
        updateMaintenanceStatus,
        toggleMaintenanceCheck,
        updateMaintenanceNotes,
        maintenanceConfig,
        updateMaintenanceConfig,
        resetMaintenanceConfig,
        lastNotice,
        clearNotice,
        signOut,
        dataError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
}
