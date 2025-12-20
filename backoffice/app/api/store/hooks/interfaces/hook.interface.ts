/* eslint-disable @typescript-eslint/no-explicit-any */
import { BeforeHook } from "./before-hook.interface";
import { NextHook } from "./next-hook.interface";

export type HookType = "before" | "next";

export type Hook = {
  type: HookType;
  hook: BeforeHook<any> | NextHook<any>;
};
