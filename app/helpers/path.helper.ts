import { SettingGetCommand } from "../commands/settings/index.command";

export function getBasePath(src: string = "") {
  const { website } = SettingGetCommand.handle();
  const normalized = src.startsWith("/") ? src : `/${src}`;

  return `${website.url}${normalized}`;
}
