/* eslint-disable @typescript-eslint/no-explicit-any */
import Clarity from "@microsoft/clarity";

export function sendClarityEvent(eventName: string) {
  if (!(window as any).clarity) return;
  Clarity.event(eventName);
}
