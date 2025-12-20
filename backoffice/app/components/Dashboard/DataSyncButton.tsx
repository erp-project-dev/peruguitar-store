"use client";

import { toast } from "sonner";

import { RefreshCcw } from "lucide-react";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";
import Button from "../Form/Button";

const storeClient = new StoreClient();

export function DataSyncButton() {
  const handleSync = () => {
    toast("Confirm data synchronization", {
      description:
        "This will regenerate the public data files used by the website.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await storeClient.execute(StoreCommand.DatasyncHandle);

            toast.success("Data synchronization succesfully completed.");
          } catch {
            toast.error(
              "Data synchronization failed. Please check the logs and try again."
            );
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
    <Button variant="info" size="lg" icon={RefreshCcw} onClick={handleSync}>
      Sync Data
    </Button>
  );
}
