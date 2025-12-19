export function getPublicImagePath(src: string) {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  return `${frontendUrl}/catalog/${src}`;
}

export function getPublicPath(src: string) {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  return `${frontendUrl}/${src}`;
}
