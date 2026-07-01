import { api } from '@/lib/api';
import { Category, Subtype } from '@/types/catalog';

export const catalogApi = {
  categories: () => api<Category[]>('/api/categories'),
  subtypes: (categoryId?: string) =>
    api<Subtype[]>(`/api/subtypes${categoryId ? `?categoryId=${categoryId}` : ''}`),
};
