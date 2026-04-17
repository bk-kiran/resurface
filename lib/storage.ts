import { MMKV } from 'react-native-mmkv';

// ─── Singleton ───────────────────────────────────────────────────────────────

const storage = new MMKV({ id: 'resurface' });

// ─── Keys ────────────────────────────────────────────────────────────────────

const KEYS = {
  hasCompletedOnboarding: 'hasCompletedOnboarding',
  todayPhotoId: 'todayPhotoId',
  todayPhotoDate: 'todayPhotoDate',
  lastScanDate: 'lastScanDate',
} as const;

// ─── hasCompletedOnboarding ──────────────────────────────────────────────────

export function getHasCompletedOnboarding(): boolean {
  return storage.getBoolean(KEYS.hasCompletedOnboarding) ?? false;
}

export function setHasCompletedOnboarding(value: boolean): void {
  storage.set(KEYS.hasCompletedOnboarding, value);
}

// ─── todayPhotoId ────────────────────────────────────────────────────────────

export function getTodayPhotoId(): string | null {
  return storage.getString(KEYS.todayPhotoId) ?? null;
}

export function setTodayPhotoId(value: string | null): void {
  if (value === null) {
    storage.delete(KEYS.todayPhotoId);
  } else {
    storage.set(KEYS.todayPhotoId, value);
  }
}

// ─── todayPhotoDate ──────────────────────────────────────────────────────────

export function getTodayPhotoDate(): string | null {
  return storage.getString(KEYS.todayPhotoDate) ?? null;
}

export function setTodayPhotoDate(value: string | null): void {
  if (value === null) {
    storage.delete(KEYS.todayPhotoDate);
  } else {
    storage.set(KEYS.todayPhotoDate, value);
  }
}

// ─── lastScanDate ────────────────────────────────────────────────────────────

export function getLastScanDate(): string | null {
  return storage.getString(KEYS.lastScanDate) ?? null;
}

export function setLastScanDate(value: string | null): void {
  if (value === null) {
    storage.delete(KEYS.lastScanDate);
  } else {
    storage.set(KEYS.lastScanDate, value);
  }
}
