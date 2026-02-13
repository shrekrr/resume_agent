import { Loader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
  size?: number;
}

const Spinner = ({ className = "", size = 20 }: SpinnerProps) => (
  <Loader2 className={`animate-spin-slow ${className}`} size={size} />
);

export default Spinner;
