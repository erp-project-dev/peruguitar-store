import DATA from "@/app/data";
import { SettingsViewModel } from "./index.type";

export const SettingsHandler = (): SettingsViewModel => {
  const {
    publishNumber,
    standard,
    premium,
    whatsAppStoreGroupLink,
    whatsAppCommunityGroupLink,
    instagram,
    clarityProjectId,
  } = getSettings();

  return {
    publishNumber,
    publishType: { standard, premium },
    whatsappLinks: {
      store: whatsAppStoreGroupLink,
      community: whatsAppCommunityGroupLink,
    },
    instagram,
    clarityProjectId,
  };
};

function getSettings() {
  const { Settings } = DATA;

  const getValue = (key: string) =>
    Settings.find(({ key: k }) => k === key)?.value || "";

  return {
    publishNumber: getValue("publish_number"),
    standard: getValue("standard"),
    premium: getValue("premium"),
    whatsAppStoreGroupLink: getValue("whatsAppStoreGroupLink"),
    whatsAppCommunityGroupLink: getValue("whatsAppCommunityGroupLink"),
    instagram: getValue("instagram"),
    clarityProjectId: getValue("clarity_project_id"),
  };
}
