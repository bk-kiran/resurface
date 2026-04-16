import { getTodayPhoto as pickFromDB } from '../lib/db';
import {
  getTodayPhotoId,
  getTodayPhotoDate,
  setTodayPhotoId,
  setTodayPhotoDate,
} from '../lib/storage';
import type { Photo } from '../types';

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Returns the photo selected for today.
 *
 * Idempotent: if a photo has already been chosen today, returns the same one
 * without touching the DB again. If the stored photo ID no longer exists in
 * the DB (e.g. after a rescan), falls back to picking a new one.
 */
export async function getTodayPhoto(): Promise<Photo | null> {
  const today = todayDateString();
  const storedDate = getTodayPhotoDate();
  const storedId = getTodayPhotoId();

  // ── Same-day cache hit ────────────────────────────────────────────────────
  if (storedDate === today && storedId !== null) {
    // Verify the photo still exists in DB (defensive — handles post-rescan edge case)
    const { getEligiblePhotos } = await import('../lib/db');
    const all = await getEligiblePhotos();
    const cached = all.find((p) => p.id === storedId) ?? null;
    if (cached) return cached;
    // Stored ID is stale — fall through to pick a fresh one
  }

  // ── Pick a new photo ──────────────────────────────────────────────────────
  const photo = await pickFromDB();

  if (photo) {
    setTodayPhotoId(photo.id);
    setTodayPhotoDate(today);
  } else {
    setTodayPhotoId(null);
    setTodayPhotoDate(null);
  }

  return photo;
}
