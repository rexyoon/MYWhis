// 백엔드 BottleResponse 와 1:1
export interface BottleResponse {
  id: string;
  name: string;
  categoryId: string | null;
  categoryLabel: string | null;
  subtypeId: string | null;
  subtypeLabel: string | null;
  totalVolumeMl: number;
  remainingVolumeMl: number;
  remainingPercent: number;
  abv: number | null;
  registeredDate: string;
  openedDate: string | null;
  opened: boolean;
  elapsedDaysSinceRegistered: number;
  elapsedDaysSinceOpened: number | null;
  imageUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// 백엔드 BottleRequest 와 1:1
export interface BottleRequest {
  name: string;
  categoryId: string | null;
  subtypeId: string | null;
  totalVolumeMl: number;
  remainingVolumeMl: number;
  abv: number | null;
  registeredDate: string;
  openedDate: string | null;
  imageUrl: string | null;
  notes: string | null;
}
