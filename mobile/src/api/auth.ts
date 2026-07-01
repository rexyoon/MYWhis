import { api } from '@/lib/api';
import { AuthResponse, LoginRequest, SignupRequest } from '@/types/auth';

export const authApi = {
  login: (body: LoginRequest) =>
    api<AuthResponse>('/api/auth/login', { method: 'POST', body, auth: false }),
  signup: (body: SignupRequest) =>
    api<AuthResponse>('/api/auth/signup', { method: 'POST', body, auth: false }),
};
