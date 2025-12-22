/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hook } from "./hooks/interfaces/hook.interface";
import { StoreCommand } from "./store.command";

export interface IncomeRequest {
  command: StoreCommand;
  id?: string;
  query?: any;
  payload?: any;
}

export type CommandHandler = {
  before?: (query?: any, payload?: any, id?: string) => Promise<void>;
  next?: (query?: any, payload?: any, id?: string) => Promise<unknown>;
  hooks?: Hook[];
};
