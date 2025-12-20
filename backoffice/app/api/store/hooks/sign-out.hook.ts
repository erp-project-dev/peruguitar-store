import { NextResponse } from "next/server";
import { NextHook } from "./interfaces/next-hook.interface";
import { AUTH_COOKIE_NAME } from "@/infrastracture/shared/constants";

export class SignOutHook implements NextHook<void> {
  async handle(_req: Request, res: NextResponse): Promise<void> {
    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: "",
      maxAge: 0,
      path: "/",
    });
  }
}
