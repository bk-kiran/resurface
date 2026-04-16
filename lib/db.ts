import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import type { Game, GameInsert, Photo, PhotoInsert, Streak } from '../types';

// ─── Singleton ───────────────────────────────────────────────────────────────

let _db: SQLiteDatabase | null = null;

async function getDB(): Promise<SQLiteDatabase> {
  if (_db) return _db;
  _db = await openDatabaseAsync('resurface.db');
  return _db;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

export async function initDB(): Promise<void> {
  const db = await getDB();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS photos (
      id           TEXT    PRIMARY KEY,
      uri          TEXT    NOT NULL,
      latitude     REAL,
      longitude    REAL,
      taken_at     INTEGER,
      memory_score REAL,
      face_count   INTEGER,
      eligible     INTEGER NOT NULL DEFAULT 0,
      played       INTEGER NOT NULL DEFAULT 0,
      created_at   INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS games (
      id             TEXT    PRIMARY KEY,
      photo_id       TEXT    REFERENCES photos(id),
      played_at      INTEGER NOT NULL,
      guess_lat      REAL,
      guess_lng      REAL,
      guess_month    INTEGER,
      guess_year     INTEGER,
      with_whom      TEXT,
      distance_km    REAL,
      month_delta    INTEGER,
      year_delta     INTEGER,
      score          INTEGER NOT NULL,
      memory_caption TEXT
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id               INTEGER PRIMARY KEY,
      current_streak   INTEGER NOT NULL DEFAULT 0,
      longest_streak   INTEGER NOT NULL DEFAULT 0,
      last_played_date TEXT    NOT NULL DEFAULT ''
    );

    INSERT OR IGNORE INTO streaks (id, current_streak, longest_streak, last_played_date)
    VALUES (1, 0, 0, '');
  `);
}

// ─── Photos ──────────────────────────────────────────────────────────────────

export async function insertPhoto(photo: PhotoInsert): Promise<void> {
  const db = await getDB();
  const now = Math.floor(Date.now() / 1000);

  await db.runAsync(
    `INSERT OR REPLACE INTO photos
      (id, uri, latitude, longitude, taken_at, memory_score, face_count, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    photo.id,
    photo.uri,
    photo.latitude ?? null,
    photo.longitude ?? null,
    photo.taken_at ?? null,
    photo.memory_score ?? null,
    photo.face_count ?? null,
    now,
  );
}

/** Used by the scanner — same as insertPhoto but also writes eligible. */
export async function upsertScannedPhoto(
  photo: PhotoInsert & { eligible: 0 | 1 },
): Promise<void> {
  const db = await getDB();
  const now = Math.floor(Date.now() / 1000);

  await db.runAsync(
    `INSERT INTO photos
      (id, uri, latitude, longitude, taken_at, memory_score, face_count, eligible, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       uri          = excluded.uri,
       latitude     = excluded.latitude,
       longitude    = excluded.longitude,
       taken_at     = excluded.taken_at,
       memory_score = excluded.memory_score,
       face_count   = excluded.face_count,
       eligible     = excluded.eligible`,
    photo.id,
    photo.uri,
    photo.latitude ?? null,
    photo.longitude ?? null,
    photo.taken_at ?? null,
    photo.memory_score ?? null,
    photo.face_count ?? null,
    photo.eligible,
    now,
  );
}

export async function getEligiblePhotos(): Promise<Photo[]> {
  const db = await getDB();
  return db.getAllAsync<Photo>(
    `SELECT * FROM photos WHERE eligible = 1 ORDER BY taken_at DESC`,
  );
}

/** Returns a random unplayed eligible photo, or falls back to any eligible photo. */
export async function getTodayPhoto(): Promise<Photo | null> {
  const db = await getDB();

  const unplayed = await db.getFirstAsync<Photo>(
    `SELECT * FROM photos WHERE eligible = 1 AND played = 0
     ORDER BY RANDOM() LIMIT 1`,
  );
  if (unplayed) return unplayed;

  // All eligible photos have been played — reset and cycle
  return db.getFirstAsync<Photo>(
    `SELECT * FROM photos WHERE eligible = 1 ORDER BY RANDOM() LIMIT 1`,
  );
}

// ─── Games ───────────────────────────────────────────────────────────────────

export async function insertGame(game: GameInsert): Promise<void> {
  const db = await getDB();
  const now = Math.floor(Date.now() / 1000);

  await db.runAsync(
    `INSERT INTO games
      (id, photo_id, played_at, guess_lat, guess_lng, guess_month, guess_year,
       with_whom, distance_km, month_delta, year_delta, score, memory_caption)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    game.id,
    game.photo_id,
    now,
    game.guess_lat ?? null,
    game.guess_lng ?? null,
    game.guess_month ?? null,
    game.guess_year ?? null,
    game.with_whom ?? null,
    game.distance_km ?? null,
    game.month_delta ?? null,
    game.year_delta ?? null,
    game.score,
    game.memory_caption ?? null,
  );

  // Mark photo as played
  await db.runAsync(
    `UPDATE photos SET played = 1 WHERE id = ?`,
    game.photo_id,
  );
}

export async function getGameHistory(): Promise<Game[]> {
  const db = await getDB();
  return db.getAllAsync<Game>(
    `SELECT * FROM games ORDER BY played_at DESC`,
  );
}

// ─── Streaks ─────────────────────────────────────────────────────────────────

export async function getStreak(): Promise<Streak> {
  const db = await getDB();
  const row = await db.getFirstAsync<Streak>(`SELECT * FROM streaks WHERE id = 1`);
  // Row is guaranteed to exist — inserted in initDB
  return row!;
}

export async function updateStreak(streak: Omit<Streak, 'id'>): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `UPDATE streaks
     SET current_streak = ?, longest_streak = ?, last_played_date = ?
     WHERE id = 1`,
    streak.current_streak,
    streak.longest_streak,
    streak.last_played_date,
  );
}
