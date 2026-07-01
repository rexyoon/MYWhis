import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'mywhis.auth';

export type StoredAuth = {
  token: string;
  email: string | null;
  nickname: string;
};

/** 로그인 정보(JWT 토큰 + 프로필)를 기기에 저장/복원 */
export const authStorage = {
  async get(): Promise<StoredAuth | null> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  },
  async set(auth: StoredAuth): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(auth));
  },
  async clear(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
  },
};
