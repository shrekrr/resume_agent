import { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { uploadResume } from "@/services/api";

interface UploadResumeStepProps {
  onComplete: () => void;
}

const UploadResumeStep = ({ onComplete }: UploadResumeStepProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (f: File) => {
    setFile(f);
    setError("");
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      await uploadResume(file);
      onComplete();
    } catch {
      setError("Upload failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">Upload Your Resume</h2>
        <p className="text-muted-foreground">Drop your resume and let AI find the perfect match</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
          dragging
            ? "border-primary bg-accent/50 scale-[1.01]"
            : file
            ? "border-success bg-success/5"
            : "border-border hover:border-primary/50 hover:bg-accent/30"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {file ? (
          <div className="flex flex-col items-center gap-3 animate-scale-in">
            <FileText size={40} className="text-success" />
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB — Ready to upload
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={40} className="text-muted-foreground" />
            <p className="font-medium text-foreground">Drag & drop your resume here</p>
            <p className="text-sm text-muted-foreground">or click to browse • PDF, DOC, DOCX</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground shadow-primary hover:opacity-90 transition-all duration-200"
      >
        {loading ? <Spinner className="mr-2" /> : null}
        {loading ? "Uploading..." : "Upload Resume"}
      </Button>
    </div>
  );
};

export default UploadResumeStep;
