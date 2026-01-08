"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

const storeClient = new StoreClient();

export function DataSyncButton() {
  const [loading, setLoading] = useState(false);

  const handleSync = () => {
    if (loading) return;

    toast("Confirm data synchronization", {
      description:
        "This will regenerate the public data files used by the website.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            setLoading(true);

            await storeClient.execute(StoreCommand.DatasyncHandle);

            toast.success("Data synchronization successfully completed.");
          } catch {
            toast.error(
              "Data synchronization failed. Please check the logs and try again."
            );
          } finally {
            setLoading(false);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick() {},
      },
    });
  };

  return (
    <div
      onClick={handleSync}
      className={`
        inline-flex items-center justify-center
        w-6 h-6 rounded-full
        border border-border
        transition
        ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-muted"
        }
      `}
      aria-disabled={loading}
    >
      <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
    </div>
  );
}
