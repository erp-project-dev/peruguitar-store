import { NextResponse } from "next/server";

export interface NextHook<TPayload> {
  handle(
    req: Request,
    res: NextResponse,
    payload?: TPayload,
    id?: string
  ): Promise<void>;
}
