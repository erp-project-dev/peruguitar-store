export interface BeforeHook<TPayload> {
  handle(req: Request, payload?: TPayload, id?: string): Promise<void>;
}
