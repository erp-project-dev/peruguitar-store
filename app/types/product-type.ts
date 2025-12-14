export interface ProductType {
  id:
    | "standard"
    | "high_end"
    | "signature"
    | "rare"
    | "discontinued"
    | "limited"
    | "vintage"
    | "handcrafted"
    | "boutique";
  name: string;
  description: string;
}
