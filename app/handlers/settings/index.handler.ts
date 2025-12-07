import DATA from "@/app/data";
import { SettingsViewModel } from "./index.type";

export const SettingsHandler = (): SettingsViewModel => {
  const {
    publishNumber,
    whatsAppStoreGroupLink,
    whatsAppCommunityGroupLink,
    instagram,
    clarityProjectId,
    websiteUrl,
    websiteTitle,
    websiteDescription,
  } = getSettings();

  return {
    publishNumber,
    whatsappLinks: {
      store: whatsAppStoreGroupLink,
      community: whatsAppCommunityGroupLink,
    },
    instagram,
    clarityProjectId,
    website: {
      url: websiteUrl,
      title: websiteTitle,
      description: websiteDescription,
    },
  };
};

function getSettings() {
  const { Settings } = DATA;

  const getValue = (key: string) =>
    Settings.find(({ key: k }) => k === key)?.value || "";

  return {
    publishNumber: getValue("publish_number"),
    whatsAppStoreGroupLink: getValue("whatsAppStoreGroupLink"),
    whatsAppCommunityGroupLink: getValue("whatsAppCommunityGroupLink"),
    instagram: getValue("instagram"),
    clarityProjectId: getValue("clarityProjectId"),
    websiteUrl: getValue("website_url"),
    websiteTitle: getValue("website_title"),
    websiteDescription: getValue("website_description"),
  };
}
