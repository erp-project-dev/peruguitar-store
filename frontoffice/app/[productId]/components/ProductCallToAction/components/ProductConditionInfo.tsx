import Tooltip from "@/features/components/Tooltip";

interface ProductConditionInfoProps {
  label: string;
  description: string;
  score: number;
}

export default function ProductConditionInfo({
  label,
  description,
  score,
}: ProductConditionInfoProps) {
  return (
    <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
      <span>
        <span className="font-bold">Estado</span>:{" "}
        <Tooltip label={description} width={200}>
          <span className="font-medium text-gray-800 cursor-help underline decoration-dashed">
            {label}
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
