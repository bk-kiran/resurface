import * as MediaLibrary from 'expo-media-library';
import { upsertScannedPhoto } from '../lib/db';
import { setLastScanDate } from '../lib/storage';
import type { PhotoInsert } from '../types';

// ─── Public types ─────────────────────────────────────────────────────────────

export type ScanResult = {
  total: number;
  eligible: number;
  durationMs: number;
};

export type ScanError = ScanResult & { error: 'PERMISSIONS_DENIED' };

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 100;
const SCORE_THRESHOLD = 0.5;

// Common screenshot aspect ratios (width:height expressed as w/h)
// 9:19.5 ≈ 0.4615, 9:20 = 0.45
const SCREENSHOT_RATIOS: Array<[number, number]> = [
  [9, 19.5],
  [9, 20],
];
const RATIO_EPSILON = 0.01;

// ─── Face detection (optional) ───────────────────────────────────────────────

type FaceDetector = {
  detectFacesAsync: (
    uri: string,
    options?: { mode?: number; detectLandmarks?: number; runClassifications?: number },
  ) => Promise<{ faces: unknown[] }>;
};

let _faceDetector: FaceDetector | null | undefined = undefined; // undefined = not yet tried

async function tryDetectFaces(uri: string): Promise<number | null> {
  if (_faceDetector === null) return null; // known unavailable

  try {
    if (_faceDetector === undefined) {
      // First call — attempt to load the module
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      _faceDetector = require('expo-face-detector') as FaceDetector;
    }
    const result = await _faceDetector.detectFacesAsync(uri, { mode: 1 });
    return result.faces.length;
  } catch {
    _faceDetector = null; // mark as unavailable for remaining photos
    return null;
  }
}

function scoreFromFaceCount(faceCount: number | null): number {
  if (faceCount === null) return 0.7; // face detector unavailable
  if (faceCount === 0) return 0.1;
  if (faceCount === 1) return 0.6;
  return 1.0; // 2+
}

// ─── Filters ─────────────────────────────────────────────────────────────────

function isScreenshotRatio(width: number, height: number): boolean {
  if (width === 0 || height === 0) return false;
  const ratio = Math.min(width, height) / Math.max(width, height);
  return SCREENSHOT_RATIOS.some(([w, h]) => {
    const target = w / h;
    return Math.abs(ratio - target) < RATIO_EPSILON;
  });
}

function isScreenshotFilename(filename: string): boolean {
  return filename.includes('Screenshot') || filename.startsWith('IMG_E');
}

// On iOS, mediaSubtypes includes 'screenshot' for system-detected screenshots
function isScreenshotSubtype(asset: MediaLibrary.Asset): boolean {
  return asset.mediaSubtypes?.includes('screenshot') ?? false;
}

function passesBaseFilter(asset: MediaLibrary.Asset): boolean {
  if (isScreenshotFilename(asset.filename)) return false;
  if (isScreenshotSubtype(asset)) return false;
  if (isScreenshotRatio(asset.width, asset.height)) return false;
  return true;
}

// ─── Core scan ───────────────────────────────────────────────────────────────

export async function runScan(
  onProgress: (scanned: number, total: number, eligible: number) => void,
): Promise<ScanResult | ScanError> {
  const start = Date.now();

  // ── Permission check ──────────────────────────────────────────────────────
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    return { total: 0, eligible: 0, durationMs: Date.now() - start, error: 'PERMISSIONS_DENIED' };
  }

  let scanned = 0;
  let eligible = 0;
  let cursor: string | undefined;
  let estimatedTotal = 0;

  // ── Paginate through all photos ───────────────────────────────────────────
  do {
    const page: MediaLibrary.PagedInfo<MediaLibrary.Asset> =
      await MediaLibrary.getAssetsAsync({
        first: PAGE_SIZE,
        after: cursor,
        mediaType: 'photo',
        sortBy: MediaLibrary.SortBy.creationTime,
      });

    if (estimatedTotal === 0) {
      estimatedTotal = page.totalCount;
    }

    for (const asset of page.assets) {
      scanned++;

      // ── Cheap filters (no extra network call) ────────────────────────────
      if (!passesBaseFilter(asset)) {
        onProgress(scanned, estimatedTotal, eligible);
        continue;
      }

      // ── Fetch asset info to get GPS location ─────────────────────────────
      let info: MediaLibrary.AssetInfo;
      try {
        info = await MediaLibrary.getAssetInfoAsync(asset, {
          shouldDownloadFromNetwork: false,
        });
      } catch {
        onProgress(scanned, estimatedTotal, eligible);
        continue;
      }

      if (!info.location) {
        onProgress(scanned, estimatedTotal, eligible);
        continue;
      }

      // ── Face detection & scoring ──────────────────────────────────────────
      const faceCount = await tryDetectFaces(info.localUri ?? asset.uri);
      const memory_score = scoreFromFaceCount(faceCount);
      const isEligible = memory_score >= SCORE_THRESHOLD;

      // ── Upsert into DB ────────────────────────────────────────────────────
      const photo: PhotoInsert & { eligible: 0 | 1 } = {
        id: asset.id,
        uri: asset.uri,
        latitude: info.location.latitude,
        longitude: info.location.longitude,
        taken_at: Math.floor(asset.creationTime / 1000),
        memory_score,
        face_count: faceCount,
        eligible: isEligible ? 1 : 0,
      };

      await upsertScannedPhoto(photo);

      if (isEligible) eligible++;
      onProgress(scanned, estimatedTotal, eligible);
    }

    cursor = page.hasNextPage ? page.endCursor : undefined;
  } while (cursor !== undefined);

  const today = new Date().toISOString().slice(0, 10);
  setLastScanDate(today);

  return { total: scanned, eligible, durationMs: Date.now() - start };
}
