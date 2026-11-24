// jeek-admin-panel/src/lib/deviceMode.ts
import { useSyncExternalStore } from 'react';

export type DeviceMode = 'phone' | 'computer';
const KEY = 'jeek_device_mode_v1';
const listeners = new Set<() => void>();

function initial(): DeviceMode {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'phone' || saved === 'computer') return saved;
  } catch {
    /* ignore */
  }
  return window.innerWidth < 768 ? 'phone' : 'computer';
}

let mode: DeviceMode = initial();

function apply() {
  document.documentElement.classList.toggle('phone-mode', mode === 'phone');
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    // "Computer" on a real phone shows the full desktop layout; "Phone" fits the screen.
    meta.setAttribute(
      'content',
      mode === 'computer' ? 'width=1280' : 'width=device-width, initial-scale=1.0',
    );
  }
}
apply();

export function setDeviceMode(next: DeviceMode) {
  mode = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* ignore */
  }
  apply();
  listeners.forEach((l) => l());
}

export function useDeviceMode(): DeviceMode {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => mode,
    () => mode,
  );
}
