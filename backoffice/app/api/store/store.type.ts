/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hook } from "./hooks/interfaces/hook.interface";
import { StoreCommand } from "./store.command";

export interface IncomeRequest {
  command: StoreCommand;
  id?: string;
  payload?: any;
}

export type CommandHandler = {
  before?: (payload?: any, id?: string) => Promise<void>;
  next?: (payload?: any, id?: string) => Promise<unknown>;
  hooks?: Hook[];
};
