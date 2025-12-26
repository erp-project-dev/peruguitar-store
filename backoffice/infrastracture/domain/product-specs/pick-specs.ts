export interface PickSpecs {
  material: string | null;
  thickness_mm: number | null;
  shape: string | null;
  size: string | null;
  grip: boolean | null;
  finish: string | null;
  flexibility: "soft" | "medium" | "hard" | null;
  color: string | null;
  pack_quantity: number | null;
  made_in: string | null;
}
