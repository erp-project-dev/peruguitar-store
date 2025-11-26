import DATA from "@/app/data";

import { SettingsViewModel } from "./index.type";

export const SettingsHandler = (): SettingsViewModel => {
  const { Settings } = DATA;

  const publishNumber =
    Settings.find((s) => s.key === "publish_number")?.value || "";

  const standard = Settings.find((s) => s.key === "standard")?.value || "";
  const premium = Settings.find((s) => s.key === "premium")?.value || "";

  const whatsAppStoreGroupLink =
    Settings.find((s) => s.key === "whatsAppStoreGroupLink")?.value || "";

  const whatsAppCommwhatsAppCommunityGroupLinkunityLink =
    Settings.find((s) => s.key === "whatsAppCommunityGroupLink")?.value || "";

  const instagram = Settings.find((s) => s.key === "instagram")?.value || "";

  return {
    publishNumber,

    publishType: {
      standard,
      premium,
    },

    whatsappLinks: {
      store: whatsAppStoreGroupLink,
      community: whatsAppCommwhatsAppCommunityGroupLinkunityLink,
    },

    instagram,
  };
};
