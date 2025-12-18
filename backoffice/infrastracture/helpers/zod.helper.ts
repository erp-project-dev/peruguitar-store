import { ZodError } from "zod";

export function getZodMessage(error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid entry";
  return `${issue.path}: ${issue.message}`;
}
