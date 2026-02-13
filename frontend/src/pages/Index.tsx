import { useState } from "react";
import { Zap } from "lucide-react";
import StepProgress from "@/components/StepProgress";
import UploadResumeStep from "@/components/steps/UploadResumeStep";
import SelectRoleStep from "@/components/steps/SelectRoleStep";
import JobRecommendationStep from "@/components/steps/JobRecommendationStep";
import ResumeSuggestionsStep from "@/components/steps/ResumeSuggestionsStep";
import ApprovalStep from "@/components/steps/ApprovalStep";
import ApplyStep from "@/components/steps/ApplyStep";

const Index = () => {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => s + 1);
  const reset = () => setStep(1);

  const renderStep = () => {
    switch (step) {
      case 1: return <UploadResumeStep onComplete={next} />;
      case 2: return <SelectRoleStep onComplete={next} />;
      case 3: return <JobRecommendationStep onComplete={next} />;
      case 4: return <ResumeSuggestionsStep onComplete={next} />;
      case 5: return <ApprovalStep onComplete={next} />;
      case 6: return <ApplyStep onComplete={reset} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="pt-8 pb-2 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-primary">
            <Zap size={18} className="text-primary-foreground" />
          </div>
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
            AI Job Matcher
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">Human-in-the-Loop • You stay in control</p>
      </header>

      {/* Main */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <StepProgress currentStep={step} />

        <div className="bg-card border rounded-2xl shadow-card p-6 md:p-8">
          {renderStep()}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Nothing is sent without your approval.
        </p>
      </main>
    </div>
  );
};

export default Index;
