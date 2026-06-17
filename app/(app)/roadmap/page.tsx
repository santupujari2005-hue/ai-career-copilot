import { RoadmapGenerator } from "@/components/roadmap/roadmap-generator";

export default function RoadmapPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Career Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          Generate a personalized 30-day plan for your target role
        </p>
      </div>
      <RoadmapGenerator />
    </div>
  );
}
