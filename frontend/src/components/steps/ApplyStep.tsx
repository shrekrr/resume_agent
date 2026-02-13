import { useState } from "react";
import { Rocket, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { applyToJob } from "@/services/api";

interface ApplyStepProps {
  onComplete: () => void;
}

const ApplyStep = ({ onComplete }: ApplyStepProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    setLoading(true);
    setError("");
    try {
      await applyToJob();
      setSuccess(true);
    } catch {
      setError("Application failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="animate-celebrate text-center space-y-6 py-8">
        <div className="mx-auto w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-primary">
          <PartyPopper size={40} className="text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-foreground">Application Sent! 🎉</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Your AI-optimized resume has been submitted. Good luck!
          </p>
        </div>
        <Button
          onClick={onComplete}
          variant="outline"
          className="h-12 px-8 text-base font-semibold"
        >
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-primary animate-scale-in">
          <Rocket size={32} className="text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">Ready to Apply</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Everything looks great. Send your application now!
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}

      <Button
        onClick={handleApply}
        disabled={loading}
        className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground shadow-primary hover:opacity-90 transition-all duration-200"
      >
        {loading ? <Spinner className="mr-2" /> : <Rocket size={18} className="mr-2" />}
        {loading ? "Sending Application..." : "Send Application"}
      </Button>
    </div>
  );
};

export default ApplyStep;
