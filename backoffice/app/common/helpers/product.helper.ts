export function getImagePath(src: string) {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  return `${frontendUrl}/catalog/${src}`;
}
