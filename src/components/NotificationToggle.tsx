// jeek-admin-panel/src/components/NotificationToggle.tsx
import { Bell, BellOff, BellRing, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { PushStatus, disablePush, enablePush, getPushStatus, syncPush } from '../lib/push';

export function NotificationToggle() {
  const { language } = useAdmin();
  const ar = language === 'ar';
  const [status, setStatus] = useState<PushStatus | 'loading'>('loading');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    try {
      setStatus(await getPushStatus());
    } catch {
      setStatus('unsupported');
    }
  }, []);

  useEffect(() => {
    void refresh();
    void syncPush(language).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const explain = (s: PushStatus): string => {
    switch (s) {
      case 'ios-install':
        return ar
          ? 'على الآيفون: افتح الموقع في Safari ← مشاركة ← "إضافة إلى الشاشة الرئيسية"، ثم افتحه من الأيقونة وفعّل الإشعارات.'
          : 'On iPhone/iPad: open this site in Safari → Share → "Add to Home Screen", then open it from the icon and enable notifications.';
      case 'unsupported':
        return ar ? 'هذا المتصفح لا يدعم إشعارات الويب.' : "This browser doesn't support web push notifications.";
      case 'not-configured':
        return ar
          ? 'مفتاح VAPID غير مضبوط في هذا الإصدار من الموقع.'
          : 'The VAPID public key is not set in this build of the site.';
      case 'blocked':
        return ar
          ? 'الإشعارات محظورة. اسمح بها من إعدادات الموقع في المتصفح ثم أعد المحاولة.'
          : 'Notifications are blocked. Allow them in the browser’s site settings, then try again.';
      default:
        return '';
    }
  };

  const onClick = async () => {
    if (busy || status === 'loading') return;
    setMessage('');
    if (status !== 'on' && status !== 'off') {
      setMessage(explain(status));
      return;
    }
    setBusy(true);
    try {
      const next = status === 'on' ? await disablePush() : await enablePush(language);
      setStatus(next);
      if (next === 'on') {
        setMessage(
          ar
            ? 'تم تفعيل الإشعارات على هذا الجهاز. ستصلك إشعارات الطلبات الجديدة حتى والمتصفح مغلق.'
            : 'Notifications enabled on this device. You’ll get new-order alerts even with the browser closed.',
        );
      } else if (next !== 'off') {
        setMessage(explain(next));
      }
    } catch {
      setMessage(
        ar
          ? 'تعذر تفعيل الإشعارات. تحقق من الاتصال وحاول مرة أخرى.'
          : 'Could not set up notifications. Check your connection and try again.',
      );
      void refresh();
    } finally {
      setBusy(false);
    }
  };

  const Icon = busy || status === 'loading' ? Loader2 : status === 'on' ? BellRing : status === 'blocked' ? BellOff : Bell;
  const label =
    status === 'on'
      ? ar ? 'الإشعارات مفعّلة' : 'Alerts on'
      : ar ? 'تفعيل الإشعارات' : 'Enable alerts';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        aria-label={ar ? 'إشعارات الطلبات الجديدة' : 'New order notifications'}
        title={label}
        className={`inline-flex items-center gap-1.5 px-3 h-10 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          status === 'on'
            ? 'border-red-600 bg-red-600 text-white hover:bg-red-700'
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-zinc-500'
        }`}
      >
        <Icon className={`w-3.5 h-3.5 ${busy || status === 'loading' ? 'animate-spin' : ''} ${status === 'on' ? '' : 'text-red-600'}`} />
        <span className="hidden sm:inline">{label}</span>
      </button>

      {message && (
        <div
          role="status"
          className="absolute end-0 top-12 z-50 w-64 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-[11px] leading-relaxed font-semibold text-zinc-800 dark:text-zinc-200 shadow-lg"
        >
          <button
            type="button"
            onClick={() => setMessage('')}
            aria-label="Dismiss"
            className="absolute top-1.5 end-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="pe-4">{message}</p>
        </div>
      )}
    </div>
  );
}
