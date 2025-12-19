import DATA from "@/app/store";

import { SettingsViewModel } from "./index.type";

export class SettingGetCommand {
  static handle(): SettingsViewModel {
    const {
      publishNumber,
      whatsAppStoreGroupLink,
      whatsAppCommunityGroupLink,
      instagram,
      clarityProjectId,
      websiteUrl,
      websiteTitle,
      websiteDescription,
    } = this.getSettings();

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
  }

  private static getSettings() {
    const { Settings } = DATA;

    const getValue = (key: string) =>
      Settings.find(({ id: k }) => k === key)?.value || "";

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
}
