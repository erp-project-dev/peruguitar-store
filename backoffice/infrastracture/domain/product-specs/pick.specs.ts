import { BaseSpecs } from "./base.specs";

export interface PickSpecs extends BaseSpecs {
  thickness_mm: number | null;
  shape: string | null;
  size: string | null;
  grip: boolean | null;
  finish: string | null;
  flexibility: "soft" | "medium" | "hard" | null;
  pack_quantity: number | null;
}
