import { SettingsHandler } from "../handlers/settings/index.handler";

export function getBasePath(src: string = "") {
  const { website } = SettingsHandler();
  const normalized = src.startsWith("/") ? src : `/${src}`;

  return `${website.url}${normalized}`;
}
