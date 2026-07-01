// 백엔드 API 베이스 URL. mobile/.env 의 EXPO_PUBLIC_API_URL 로 주입.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.47:8080';
