import { InterviewCoach } from "@/components/interview/interview-coach";

export default function InterviewPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interview Coach</h1>
        <p className="text-muted-foreground mt-1">
          Practice interviews with AI-generated questions and get detailed feedback
        </p>
      </div>
      <InterviewCoach />
    </div>
  );
}
