// ─── Photo ───────────────────────────────────────────────────────────────────

export interface Photo {
  /** Asset ID from expo-media-library */
  id: string;
  uri: string;
  latitude: number | null;
  longitude: number | null;
  /** Unix timestamp (seconds) */
  taken_at: number | null;
  /** Classifier score 0–1 */
  memory_score: number | null;
  face_count: number | null;
  /** 1 = eligible for daily play */
  eligible: 0 | 1;
  /** 1 = has been played at least once */
  played: 0 | 1;
  /** Unix timestamp (seconds) row was inserted */
  created_at: number;
}

export type PhotoInsert = Omit<Photo, 'eligible' | 'played' | 'created_at'>;

// ─── Game ────────────────────────────────────────────────────────────────────

export interface Game {
  id: string;
  photo_id: string;
  /** Unix timestamp (seconds) */
  played_at: number;
  guess_lat: number | null;
  guess_lng: number | null;
  guess_month: number | null;
  guess_year: number | null;
  with_whom: string | null;
  distance_km: number | null;
  month_delta: number | null;
  year_delta: number | null;
  score: number;
  memory_caption: string | null;
}

export type GameInsert = Omit<Game, 'played_at'>;

// ─── Streak ──────────────────────────────────────────────────────────────────

export interface Streak {
  /** Always 1 — single-row table */
  id: 1;
  current_streak: number;
  longest_streak: number;
  /** ISO date string YYYY-MM-DD */
  last_played_date: string;
}
