import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  onboarding: 'has_completed_onboarding',
  todayPhoto: 'today_photo_id',
  lastScan: 'last_scan_date',
};

export const getHasCompletedOnboarding = async (): Promise<boolean> => {
  const val = await AsyncStorage.getItem(KEYS.onboarding);
  return val === 'true';
};

export const setHasCompletedOnboarding = async (v: boolean) => {
  await AsyncStorage.setItem(KEYS.onboarding, String(v));
};

export const getTodayPhotoId = async (): Promise<string | null> => {
  return AsyncStorage.getItem(KEYS.todayPhoto);
};

export const setTodayPhotoId = async (v: string) => {
  await AsyncStorage.setItem(KEYS.todayPhoto, v);
};

export const getLastScanDate = async (): Promise<string | null> => {
  return AsyncStorage.getItem(KEYS.lastScan);
};

export const setLastScanDate = async (v: string) => {
  await AsyncStorage.setItem(KEYS.lastScan, v);
};
