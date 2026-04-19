import type { School } from "./School";
import type { Hobby } from "./Hobby";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  school_id?: number;
  school_name?: string;
  school?: School;
  hobbies?: Hobby[];
  hobby_ids?: number[];
}
