/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Service {
  findById(id: string): Promise<any | null>;
  findAll(): Promise<any[]>;
  create(data: any): Promise<any>;
  update(id: string, data: Partial<any>): Promise<any>;
  remove(id: string): Promise<void>;
}
