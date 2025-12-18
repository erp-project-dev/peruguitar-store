interface StepCardProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="p-6 rounded-xl shadow-sm bg-gray-800 text-white">
      <div className="flex items-start gap-6">
        <div className="flex items-center justify-center rounded-full text-white font-bold text-2xl">
          {number}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-400">{children}</p>
        </div>
      </div>
    </div>
  );
}
