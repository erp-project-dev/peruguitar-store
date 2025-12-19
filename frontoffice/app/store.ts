import type { StoreData } from "@/features/types/store.type";
import jsonData from "./db/store.json";

export default Object.freeze(jsonData) as unknown as StoreData;
