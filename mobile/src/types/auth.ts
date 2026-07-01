export interface AuthResponse {
  token: string;
  email: string | null;
  nickname: string;
}
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
