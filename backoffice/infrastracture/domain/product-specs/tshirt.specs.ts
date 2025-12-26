export interface TShirtSpecs {
  material: string | null;
  fabric_weight_gsm: number | null;
  fit: "regular" | "slim" | "oversize" | null;
  size: string | null;
  color: string | null;
  print_type: string | null;
  collar_type: string | null;
  sleeve_type: string | null;
  unisex: boolean | null;
  made_in: string | null;
}
