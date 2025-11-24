import type { StoreData } from "./types/store.type";
import jsonData from "../data.json";

export default Object.freeze(jsonData) as unknown as StoreData;
