// jeek-admin-panel/src/components/DeviceSwitch.tsx
import { Monitor, Smartphone } from 'lucide-react';
import { setDeviceMode, useDeviceMode } from '../lib/deviceMode';

export function DeviceSwitch({ language }: { language: 'en' | 'ar' }) {
  const mode = useDeviceMode();
  const items = [
    { id: 'computer' as const, icon: Monitor, label: language === 'ar' ? 'كمبيوتر' : 'Computer' },
    { id: 'phone' as const, icon: Smartphone, label: language === 'ar' ? 'هاتف' : 'Phone' },
  ];
  return (
    <div
      role="group"
      aria-label={language === 'ar' ? 'نوع الجهاز' : 'Device type'}
      className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-0.5 text-xs font-semibold shrink-0"
    >
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setDeviceMode(id)}
          aria-pressed={mode === id}
          title={label}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
            mode === id
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden min-[420px]:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
