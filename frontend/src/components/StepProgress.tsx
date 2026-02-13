import { Check } from "lucide-react";

const STEPS = [
  "Upload Resume",
  "Select Role",
  "Job Match",
  "AI Suggestions",
  "Approve",
  "Apply",
];

interface StepProgressProps {
  currentStep: number;
}

const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={label} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {i > 0 && (
                <div
                  className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 transition-colors duration-300 ${
                    isCompleted ? "bg-primary" : "bg-border"
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Circle */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "gradient-primary text-primary-foreground shadow-primary"
                    : isActive
                    ? "bg-primary text-primary-foreground shadow-primary animate-scale-in"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check size={14} /> : step}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-[11px] font-medium transition-colors duration-300 text-center leading-tight ${
                  isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
