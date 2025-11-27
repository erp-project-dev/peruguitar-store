"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

import { SettingsHandler } from "../handlers/settings/index.handler";

export default function ClarityInitializer() {
  useEffect(() => {
    console.info("Initializing Clarity Analytics");
    Clarity.init(SettingsHandler().clarityProjectId);
  }, []);

  return null;
}
