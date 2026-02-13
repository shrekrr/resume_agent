import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { approveResume } from "@/services/api";

interface ApprovalStepProps {
  onComplete: () => void;
}

const ApprovalStep = ({ onComplete }: ApprovalStepProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    setLoading(true);
    setError("");
    try {
      await approveResume();
      onComplete();
    } catch {
      setError("Failed to approve. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-primary animate-scale-in">
          <ShieldCheck size={32} className="text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">Confirm & Approve</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your optimized resume is ready. Confirm to proceed with the application.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-5 shadow-card">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Resume</span>
            <span className="text-success font-medium">Optimized ✓</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Skills Updated</span>
            <span className="text-success font-medium">Yes ✓</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Human Reviewed</span>
            <span className="text-success font-medium">Yes ✓</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}

      <Button
        onClick={handleApprove}
        disabled={loading}
        className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground shadow-primary hover:opacity-90 transition-all duration-200"
      >
        {loading ? <Spinner className="mr-2" /> : null}
        {loading ? "Confirming..." : "Confirm & Apply"}
      </Button>
    </div>
  );
};

export default ApprovalStep;
