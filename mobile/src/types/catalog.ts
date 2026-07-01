export interface Category {
  id: string;
  labelKo: string;
  sortOrder: number;
}
export interface Subtype {
  id: string;
  categoryId: string;
  labelKo: string;
  sortOrder: number;
}
