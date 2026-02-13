import { useState } from "react";
import { ChevronDown, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { selectRole } from "@/services/api";

const ROLES = [
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "AI Engineer",
  "DevOps Engineer",
];

interface SelectRoleStepProps {
  onComplete: () => void;
}

const SelectRoleStep = ({ onComplete }: SelectRoleStepProps) => {
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!role) return;
    setLoading(true);
    setError("");
    try {
      await selectRole(role);
      onComplete();
    } catch {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">Select Your Role</h2>
        <p className="text-muted-foreground">Choose the role you're looking for</p>
      </div>

      {/* Custom dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-card shadow-card text-left transition-all duration-200 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <span className={role ? "text-foreground font-medium" : "text-muted-foreground"}>
            {role || "Select a role..."}
          </span>
          <ChevronDown
            size={18}
            className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full bg-card border rounded-xl shadow-card-hover animate-scale-in overflow-hidden">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-accent ${
                  role === r ? "bg-accent text-accent-foreground" : "text-foreground"
                }`}
              >
                <Briefcase size={16} className="text-primary" />
                <span className="font-medium">{r}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!role || loading}
        className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground shadow-primary hover:opacity-90 transition-all duration-200"
      >
        {loading ? <Spinner className="mr-2" /> : null}
        {loading ? "Loading Jobs..." : "Find Jobs"}
      </Button>
    </div>
  );
};

export default SelectRoleStep;
