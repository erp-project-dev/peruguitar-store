import { SettingsHandler } from "../handlers/settings/index.handler";

export function getPublicPath(src: string = "") {
  const { website } = SettingsHandler();
  return `${website.url}${src}`;
}
