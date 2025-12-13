export function getInternationalPhone(
  country: string,
  phone: string,
  options?: { withPlus?: boolean }
): string | null {
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
  if (!callingCode) return null;

  const cleanPhone = String(phone).replace(/\D/g, "");
  if (!cleanPhone) return null;

  const prefix = options?.withPlus === false ? callingCode : `+${callingCode}`;

  return `${prefix}${cleanPhone}`;
}
