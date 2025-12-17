import Tooltip from "@/features/components/Tooltip";

interface ProductStatusInfoProps {
  statusLabel: string;
  statusDescription: string;
  score: number;
}

export default function ProductStatusInfo({
  statusLabel,
  statusDescription,
  score,
}: ProductStatusInfoProps) {
  return (
    <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
      <span>
        <span className="font-bold">Estado</span>:{" "}
        <Tooltip label={statusDescription} width={200}>
          <span className="font-medium text-gray-800 cursor-help underline decoration-dashed">
            {statusLabel}
          </span>
        </Tooltip>
      </span>

      <span>
        <span className="font-bold">Puntuación</span>:{" "}
        <span className="font-medium text-gray-800">{score}/5</span>
      </span>
    </div>
  );
}
