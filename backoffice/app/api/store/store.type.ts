/* eslint-disable @typescript-eslint/no-explicit-any */
import { StoreCommand } from "./store.command";

export interface IncomeRequest {
  command: StoreCommand;
  id?: string;
  payload?: any;
}
