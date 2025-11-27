import {
  translateProductStatus,
  translateStatusScore,
} from "@/app/helpers/product.helper";

interface ProductStatusProps {
  status: string;
  statusScore: number;
}

export default function ProductStatus({
  status,
  statusScore,
}: ProductStatusProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold">Estado</h2>

      <div className="flex items-center gap-6">
        <div className="w-80 text-center">
          <p className="text-5xl font-bold leading-none">
            {statusScore}
            <span className="text-2xl font-semibold opacity-70"> / 5</span>
          </p>
          <p className="font-bold">{translateProductStatus(status)}</p>
        </div>

        <p className="text-gray-600 leading-tight text-base ">
          {translateStatusScore(statusScore)}
        </p>
      </div>
    </>
  );
}
