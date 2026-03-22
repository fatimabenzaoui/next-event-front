import type { School } from "./School";

export interface Association {
  id: number;
  name: string;
  description: string;
  school: School;
}