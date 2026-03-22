import type { Association } from "./Association";
import type { EventAddress } from "./EventAddress";
import type { EventCategory } from "./EventCategory";

export interface Event {
  id?: number;
  name?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  max_participants?: number;

  address?: EventAddress;
  flyer_path?: string;
  category?: EventCategory;
  category_id?: number;
  category_name?: string;
  association_id: number;
  association: Association;
  school_id?: number;
}