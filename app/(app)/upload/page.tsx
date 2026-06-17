import { ResumeUploadForm } from "@/components/upload/resume-upload-form";

export default function UploadPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Upload</h1>
        <p className="text-muted-foreground mt-1">
          Upload your PDF resume for AI analysis and scoring
        </p>
      </div>
      <ResumeUploadForm />
    </div>
  );
}
