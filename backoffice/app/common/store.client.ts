/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomeRequest } from "../api/store/store.type";
import { StoreCommand } from "../api/store/store.command";

export type RequestOptions = {
  cacheTtlSeconds?: number;
};

function isOptions(value: any): value is RequestOptions {
  return value && typeof value === "object" && "cacheTtlSeconds" in value;
}

function isFilePayload(payload?: any): payload is File[] {
  return (
    Array.isArray(payload) && payload.length > 0 && payload[0] instanceof File
  );
}

export class StoreClient {
  private static readonly ENDPOINT = "/api/store";

  private getCacheKey(payload: IncomeRequest): string {
    return `store:${payload.command}:${payload.id ?? "global"}`;
  }

  private readCache<R>(key: string, requestedTtl?: number): R | null {
    if (typeof window === "undefined" || !requestedTtl) return null;

    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      const { value, expiresAt, ttlSeconds } = JSON.parse(raw);

      if (requestedTtl < ttlSeconds || Date.now() > expiresAt) {
        localStorage.removeItem(key);
        return null;
      }

      return value as R;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  private writeCache<R>(key: string, value: R, ttlSeconds: number) {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      key,
      JSON.stringify({
        value,
        ttlSeconds,
        expiresAt: Date.now() + ttlSeconds * 1000,
      })
    );
  }

  private async request<R>(
    payload: IncomeRequest,
    options?: RequestOptions
  ): Promise<R> {
    const ttl = options?.cacheTtlSeconds;
    const cacheKey = this.getCacheKey(payload);

    if (ttl) {
      const cached = this.readCache<R>(cacheKey, ttl);
      if (cached !== null) return cached;
    }

    let res: Response;

    if (isFilePayload(payload.payload)) {
      const form = new FormData();
      form.append("command", payload.command);
      if (payload.id) form.append("id", payload.id);

      payload.payload.forEach((file) => {
        form.append("payload", file);
      });

      res = await fetch(StoreClient.ENDPOINT, {
        method: "POST",
        body: form,
      });
    } else {
      res = await fetch(StoreClient.ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.error ?? "Store request failed");
    }

    if (ttl) {
      this.writeCache(cacheKey, response.data, ttl);
    }

    return response.data as R;
  }

  execute<R>(command: StoreCommand, options?: RequestOptions): Promise<R>;
  execute<R>(
    command: StoreCommand,
    id: string,
    options?: RequestOptions
  ): Promise<R>;
  execute<R>(
    command: StoreCommand,
    payload: any,
    options?: RequestOptions
  ): Promise<R>;
  execute<R>(
    command: StoreCommand,
    id: string,
    payload: any,
    options?: RequestOptions
  ): Promise<R>;

  execute<R>(
    command: StoreCommand,
    a?: string | any | RequestOptions,
    b?: any | RequestOptions,
    c?: RequestOptions
  ): Promise<R> {
    let payload: IncomeRequest;
    let options: RequestOptions | undefined;

    if (isOptions(a)) {
      payload = { command };
      options = a;
    } else if (typeof a === "string" && b === undefined) {
      payload = { command, id: a };
    } else if (typeof a === "string" && isOptions(b)) {
      payload = { command, id: a };
      options = b;
    } else if (typeof a === "string") {
      payload = { command, id: a, payload: b };
      options = c;
    } else if (a !== undefined) {
      payload = { command, payload: a };
      options = b as RequestOptions | undefined;
    } else {
      payload = { command };
    }

    return this.request<R>(payload, options);
  }
}
