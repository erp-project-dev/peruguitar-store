export function getWhatsappLink(
  country: string,
  phone: string,
  message?: string
): string {
  const normalizedCountry = country
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const COUNTRY_CALLING_CODE: Record<string, string> = {
    peru: "51",
    colombia: "57",
    chile: "56",
    argentina: "54",
  };

  const callingCode = COUNTRY_CALLING_CODE[normalizedCountry];

  const cleanPhone = String(phone).replace(/\D/g, "");
  const fullPhone = `${callingCode}${cleanPhone}`;

  if (!message) {
    return `https://wa.me/${fullPhone}`;
  }

  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(
    message.trim()
  )}`;
}
