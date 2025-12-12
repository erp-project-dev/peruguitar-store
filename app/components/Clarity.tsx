"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

import { SettingGetCommand } from "../commands/settings/index.command";

export default function ClarityInitializer() {
  useEffect(() => {
    if (window.location.hostname.includes("localhost")) {
      console.warn("Clarity Analytics disabled on localhost");
      return;
    }

    console.info("Initializing Clarity Analytics");

    Clarity.init(SettingGetCommand.handle().clarityProjectId);
  }, []);

  return null;
}
