import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/infrastracture/shared/constants";

export type AuthUser = {
  id: string;
  role: string;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  const currentCookie = await cookies();

  const cookie = currentCookie.get(AUTH_COOKIE_NAME)?.value;
  if (!cookie) return null;

  try {
    return JSON.parse(cookie) as AuthUser;
  } catch {
    return null;
  }
}
