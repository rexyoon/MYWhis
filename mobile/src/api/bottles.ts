import { api } from '@/lib/api';
import { BottleRequest, BottleResponse } from '@/types/bottle';

export const bottleApi = {
  list: () => api<BottleResponse[]>('/api/bottles'),
  get: (id: string) => api<BottleResponse>(`/api/bottles/${id}`),
  create: (body: BottleRequest) =>
    api<BottleResponse>('/api/bottles', { method: 'POST', body }),
  update: (id: string, body: BottleRequest) =>
    api<BottleResponse>(`/api/bottles/${id}`, { method: 'PUT', body }),
  remove: (id: string) =>
    api<null>(`/api/bottles/${id}`, { method: 'DELETE' }),
};
