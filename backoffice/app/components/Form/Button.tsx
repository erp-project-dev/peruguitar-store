import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type ButtonVariant =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default:
    "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-400",
  primary:
    "bg-white text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-300 border border-neutral-300",
  info: "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-400",
  success: "bg-green-600 text-white hover:bg-green-500 focus:ring-green-400",
  warning: "bg-yellow-500 text-black hover:bg-yellow-400 focus:ring-yellow-300",
  danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-400",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2.5 text-base",
};

const ICON_SIZE: Record<ButtonSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export default function Button({
  children,
  icon: Icon,
  variant = "default",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ].join(" ")}
    >
      {Icon && <Icon className={ICON_SIZE[size]} strokeWidth={2} />}
      <span className="leading-none">{children}</span>
    </button>
  );
}
