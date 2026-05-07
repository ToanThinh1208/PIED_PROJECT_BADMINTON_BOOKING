export interface CreateCourtRequest {
  name: string;
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  address: string;
  latitude: number; // double in backend
  longitude: number; // double in backend
  mapUrl: string;
  pictureUrl: File | null;
}

export interface MyCourtListItem {
  id: string;
  name: string;
  status: string;
  address: string;
  openTime: string;
  closeTime: string;
  pictureUrl: string;
}

export interface GetMyCourtsRequest {
  pageIndex: number;
  pageSize: number;
  name?: string;
}
