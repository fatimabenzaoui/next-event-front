import type { SchoolAddress } from "./SchoolAddress";

export interface School {
  id: number;
  name: string;
  email: string;
  phone: string;
  street: string;
  zip_code: string;
  city_id: number;
  address?: SchoolAddress;
}