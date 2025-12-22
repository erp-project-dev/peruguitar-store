/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import { ApplicationError } from "@/infrastracture/shared/error";
import { Hook } from "./hooks/interfaces/hook.interface";
import { StoreCommandHandler } from "./store.handler";
import { IncomeRequest } from "./store.type";
import { StoreCommand } from "./store.command";

async function resolveHooks(
  hooks: Hook[] | undefined,
  type: "before" | "next",
  req: Request,
  res: NextResponse,
  payload?: any,
  id?: string
) {
  if (!hooks) return;

  for (const entry of hooks) {
    if (entry.type === type) {
      await entry.hook.handle(req, res, payload, id);
    }
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const body = await readIncomeRequest(req, contentType);

    return await handleCommand(req, body);
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", message: error?.message },
      { status: 500 }
    );
  }
}

async function handleCommand(req: Request, body: IncomeRequest) {
  const { command, id, payload, query } = body;

  if (!command) {
    return NextResponse.json({ error: "Command is required" }, { status: 400 });
  }

  const handler = StoreCommandHandler[command];
  if (!handler) {
    return NextResponse.json(
      { error: `Command not found: ${command}` },
      { status: 400 }
    );
  }

  if (handler.before) {
    await handler.before(query, payload, id);
  }

  const result = handler.next
    ? await handler.next(query, payload, id)
    : undefined;

  const res = NextResponse.json({
    command,
    data: result,
    identifier: id ?? null,
  });

  await resolveHooks(handler.hooks, "next", req, res, result, id);

  return res;
}

async function readIncomeRequest(
  req: Request,
  contentType: string
): Promise<IncomeRequest> {
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    return {
      command: formData.get("command") as StoreCommand,
      id: formData.get("id") as string,
      payload: formData.getAll("payload") as File[],
      query: formData.getAll("query"),
    };
  }

  return req.json() as Promise<IncomeRequest>;
}
