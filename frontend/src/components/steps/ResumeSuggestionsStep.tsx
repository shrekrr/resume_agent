import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { getResumeSuggestions } from "@/services/api";

interface ResumeSuggestionsStepProps {
  onComplete: () => void;
}

interface Suggestions {
  missing_skills?: string[];
  improvements?: string[];
  updated_resume?: string;
  suggestions?: string;
}

const ResumeSuggestionsStep = ({ onComplete }: ResumeSuggestionsStepProps) => {
  const [data, setData] = useState<Suggestions | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getResumeSuggestions();
        console.log("Resume suggestions response:", data);
        setData(data);
        setResumeText(data.suggestions || "");
      } catch {
        setError("Failed to load suggestions.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Spinner size={32} className="text-primary" />
        <p className="mt-4 text-muted-foreground">AI is analyzing your resume...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">AI Suggestions</h2>
        <p className="text-muted-foreground">Review and edit the improvements before approving</p>
      </div>

      {data?.missing_skills && data.missing_skills.length > 0 && (
        <div className="bg-card border rounded-xl p-5 shadow-card space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-primary" /> Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.missing_skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data?.improvements && data.improvements.length > 0 && (
        <div className="bg-card border rounded-xl p-5 shadow-card space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" /> Suggested Improvements
          </h3>
          <ul className="space-y-2">
            {data.improvements.map((item, i) => (
              <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Updated Resume</label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}

      <Button
        onClick={onComplete}
        className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground shadow-primary hover:opacity-90 transition-all duration-200"
      >
        Approve Changes
      </Button>
    </div>
  );
};

export default ResumeSuggestionsStep;
