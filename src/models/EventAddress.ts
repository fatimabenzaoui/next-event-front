export interface EventAddress {
  id?: number;
  street?: string;
  zip_code?: string;
  city_id?: number;
  city?: {
    id?: number;
    name?: string;
    zip_code?: string;
  };
  latitude?: number;
  longitude?: number;
}