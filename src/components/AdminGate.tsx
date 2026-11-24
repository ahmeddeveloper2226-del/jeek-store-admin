import { Loader2, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { STORE_LOGO } from '../data/catalog';
import { ADMIN_EMAIL, auth, isFirebaseConfigured } from '../lib/firebase';
import { asset } from '../lib/asset';

type AuthState = 'loading' | 'signed-out' | 'signed-in';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-zinc-950 via-red-600 to-zinc-950 shadow-md">
            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center">
              <img
                src={asset(STORE_LOGO)}
                alt="Jeek Store"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
          </div>
          <h1 className="font-syne text-2xl font-extrabold tracking-tight">Admin Panel</h1>
        </div>
        {children}
      </div>
      <p dir="ltr" className="mt-6 font-mono-tabular text-[11px] text-zinc-500">
        developed by IntelligentEra . Ahmed Mohamed
      </p>
    </div>
  );
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>('loading');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (user) => {
      if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setState('signed-in');
      } else {
        if (user) void signOut(auth!);
        setState('signed-out');
      }
    });
  }, []);

  if (!isFirebaseConfigured || !auth) {
    return (
      <Shell>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
          Firebase is not configured. Add the <code className="font-mono-tabular">VITE_FIREBASE_*</code>{' '}
          values and rebuild the site (see README).
        </p>
      </Shell>
    );
  }

  if (state === 'loading') {
    return (
      <Shell>
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
        </div>
      </Shell>
    );
  }

  if (state === 'signed-in') return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    } catch (err) {
      const code = (err as { code?: string }).code || '';
      setError(
        code === 'auth/too-many-requests'
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : code === 'auth/network-request-failed'
            ? 'Network error. Check your connection and try again.'
            : 'Incorrect password.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Password</span>
          <div className="mt-1.5 relative">
            <Lock className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 ps-10 pe-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-red-600"
              placeholder="Enter admin password"
            />
          </div>
        </label>
        {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="w-full h-11 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </Shell>
  );
}
