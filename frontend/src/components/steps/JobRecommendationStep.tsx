import { useState, useEffect } from "react";
import { X, Heart, Building2, MapPin } from "lucide-react";
import Spinner from "@/components/Spinner";
import { getJob, swipeJob } from "@/services/api";

interface JobRecommendationStepProps {
  onComplete: () => void;
}

interface Job {
  title: string;
  company: string;
  location?: string;
  description: string;
}

const JobRecommendationStep = ({ onComplete }: JobRecommendationStepProps) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState<"like" | "reject" | null>(null);
  const [error, setError] = useState("");

  const fetchJob = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getJob();
      setJob(data);
    } catch {
      setError("No more jobs available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const handleSwipe = async (action: "like" | "reject") => {
    setSwiping(action);
    try {
      await swipeJob(action);
      if (action === "like") {
        onComplete();
      } else {
        await fetchJob();
      }
    } catch {
      setError("Failed to process. Try again.");
    } finally {
      setSwiping(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Spinner size={32} className="text-primary" />
        <p className="mt-4 text-muted-foreground">Finding your next opportunity...</p>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">Your Job Match</h2>
        <p className="text-muted-foreground">Swipe right to like, left to skip</p>
      </div>

      {job && (
        <div
          className={`bg-card border rounded-2xl shadow-card p-6 space-y-4 transition-all duration-300 ${
            swiping === "like"
              ? "animate-slide-left opacity-80"
              : swiping === "reject"
              ? "animate-slide-right opacity-80"
              : "animate-scale-in"
          }`}
        >
          <div>
            <h3 className="text-xl font-display font-bold text-foreground">{job.title}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 size={14} /> {job.company}
              </span>
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {job.location}
                </span>
              )}
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto pr-2 text-sm text-foreground/80 leading-relaxed">
            {job.description}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => handleSwipe("reject")}
          disabled={!!swiping}
          className="flex-1 h-14 rounded-xl border-2 border-destructive/30 text-destructive font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-destructive/10 hover:border-destructive/60 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {swiping === "reject" ? <Spinner size={18} /> : <X size={22} />}
          Skip
        </button>
        <button
          onClick={() => handleSwipe("like")}
          disabled={!!swiping}
          className="flex-1 h-14 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-primary transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {swiping === "like" ? <Spinner size={18} /> : <Heart size={22} />}
          Like
        </button>
      </div>
    </div>
  );
};

export default JobRecommendationStep;
