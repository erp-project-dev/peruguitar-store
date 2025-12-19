/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import { ApplicationError } from "@/infrastracture/shared/error";

import { StoreCommandHandler } from "./store.handler";
import { IncomeRequest } from "./store.type";
import { StoreCommand } from "./store.command";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    const response = await (contentType.includes("multipart/form-data")
      ? handleMultipart(req)
      : handleJson(req));

    return response;
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleJson(req: Request) {
  const body = (await req.json()) as IncomeRequest;
  const { command, id, payload } = body;

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

  const result = await handler(id, payload);

  return NextResponse.json({
    command,
    data: result,
    identifier: id ?? null,
  });
}

async function handleMultipart(req: Request) {
  const formData = await req.formData();

  const body: IncomeRequest = {
    command: formData.get("command") as StoreCommand,
    id: formData.get("id") as string,
    payload: formData.getAll("payload") as File[],
  };
  const { command, id, payload } = body;

  if (!command || !id) {
    return NextResponse.json(
      { error: "command and id are required" },
      { status: 400 }
    );
  }

  const handler = StoreCommandHandler[command];

  if (!handler) {
    return NextResponse.json(
      { error: `Command not found: ${command}` },
      { status: 400 }
    );
  }

  const result = await handler(id, payload);

  return NextResponse.json({
    command,
    data: result,
    identifier: id,
  });
}
