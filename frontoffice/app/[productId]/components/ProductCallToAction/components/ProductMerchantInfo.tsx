import { User, MapPin, Calendar } from "lucide-react";

interface ProductMerchantInfoProps {
  fullName: string;
  country: string;
  state: string;
  city: string;
  publishDate: Date;
}

export default function ProductMerchantInfo({
  fullName,
  country,
  state,
  city,
  publishDate,
}: ProductMerchantInfoProps) {
  return (
    <div className="flex flex-col gap-2 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4" />
        <span className="font-medium">{fullName}</span>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        <span>
          {country}, {state}, {city}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>Publicado el {publishDate.toLocaleDateString("es-PE")}</span>
      </div>
    </div>
  );
}
