/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import { ApplicationError } from "@/infrastracture/shared/error";

import { StoreCommandHandler } from "./store.handler";
import { IncomeRequest } from "./store.type";
import { StoreCommand } from "./store.command";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      return handleMultipart(req);
    }

    return handleJson(req);
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        {
          status:
            error.code === "taken"
              ? 409
              : error.code === "not-found"
              ? 404
              : error.code === "schema-invalid"
              ? 400
              : 400,
        }
      );
    }

    console.error("[STORE_API_ERROR]", error);

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
