// import type { User } from "@/infrastracture/domain/user.entity";
import { NextResponse } from "next/server";
import { NextHook } from "./interfaces/next-hook.interface";

import { User } from "@/infrastracture/domain/user.entity";
import { AUTH_COOKIE_NAME } from "@/infrastracture/shared/constants";

/**
 * AUTH COOKIE CONFIG
 * Do NOT modify these values without understanding
 * the authentication flow.
 */
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 6; // 6 hours

export class SignInHook implements NextHook<User> {
  async handle(
    _req: Request,
    res: NextResponse,
    payload?: User
  ): Promise<void> {
    if (!payload) return;

    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: JSON.stringify({
        id: payload._id,
        role: payload.role,
      }),
      httpOnly: true,
      maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }
}
