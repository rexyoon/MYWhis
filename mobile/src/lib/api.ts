import { API_BASE_URL } from './config';
import { authStorage } from './authStorage';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean; // 기본 true: 저장된 JWT 를 Authorization 헤더로 부착
};

/** 백엔드 REST 호출 공통 래퍼 */
export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const stored = await authStorage.get();
    if (stored?.token) headers.Authorization = `Bearer ${stored.token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, '서버에 연결할 수 없습니다. 백엔드 실행 여부와 주소(.env)를 확인하세요.');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && (data.message as string)) || `요청 실패 (${res.status})`;
    throw new ApiError(res.status, message);
  }
  return data as T;
}
