/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomeRequest } from "../api/store/store.type";
import { StoreCommand } from "../api/store/store.command";

export type RequestOptions = {
  cacheTtlSeconds?: number;
};

type ExecuteArgs = {
  id?: string;
  payload?: any;
  query?: Record<string, any>;
  options?: RequestOptions;
};

function isFilePayload(payload?: any): payload is File[] {
  return (
    Array.isArray(payload) && payload.length > 0 && payload[0] instanceof File
  );
}

export class StoreClient {
  private static readonly ENDPOINT = "/api/store";

  /* ---------------- cache helpers ---------------- */

  private getCacheKey(payload: IncomeRequest): string {
    const queryKey = payload.query ? JSON.stringify(payload.query) : "no-query";

    return `store:${payload.command}:${payload.id ?? "global"}:${queryKey}`;
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

  /* ---------------- request ---------------- */

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

    // ---------- FILE PAYLOAD ----------
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
    }
    // ---------- JSON PAYLOAD ----------
    else {
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

  /* ---------------- public API ---------------- */

  execute<R>(
    command: StoreCommand,
    { id, payload, query, options }: ExecuteArgs = {}
  ): Promise<R> {
    const income: IncomeRequest = {
      command,
      id,
      payload,
      query,
    };

    return this.request<R>(income, options);
  }
}
