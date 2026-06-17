"use client";

import { useState } from "react";
import { Loader2, Map, CheckCircle2 } from "lucide-react";
import { TARGET_ROLES } from "@/types";
import type { RoadmapContent, SkillGapAnalysis } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type EnrichedRoadmap = RoadmapContent & { skillGap?: SkillGapAnalysis };

export function RoadmapGenerator() {
  const [targetRole, setTargetRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<EnrichedRoadmap | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!targetRole) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setRoadmap(data.content);
      setProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const weeks = roadmap
    ? [
        { label: "Week 1", items: roadmap.thirtyDayPlan.week1 },
        { label: "Week 2", items: roadmap.thirtyDayPlan.week2 },
        { label: "Week 3", items: roadmap.thirtyDayPlan.week3 },
        { label: "Week 4", items: roadmap.thirtyDayPlan.week4 },
      ]
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Career Roadmap</CardTitle>
          <CardDescription>
            Select your target role to get a personalized 30-day plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={targetRole} onValueChange={setTargetRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select target career role" />
            </SelectTrigger>
            <SelectContent>
              {TARGET_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={!targetRole || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating roadmap...
              </>
            ) : (
              <>
                <Map className="mr-2 h-4 w-4" />
                Generate Roadmap
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {roadmap && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{roadmap.title}</CardTitle>
              <CardDescription>Target: {roadmap.targetRole}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="mb-4" />
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((p) => (
                  <Button
                    key={p}
                    variant={progress >= p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProgress(p)}
                  >
                    {p}%
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="plan">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="plan">30-Day Plan</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="space-y-4 mt-4">
              {weeks.map((week) => (
                <Card key={week.label}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{week.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {week.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Weekly Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {roadmap.weeklyMilestones.map((m, i) => (
                      <li key={i} className="text-sm">
                        <Badge variant="outline" className="mr-2">
                          W{i + 1}
                        </Badge>
                        {m}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.requiredSkills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {roadmap.skillGap && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Skill Gap Analysis</CardTitle>
                      <CardDescription>
                        Missing skills with priority and difficulty
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {roadmap.skillGap.missingSkills.map((skill) => (
                          <div
                            key={skill.name}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div>
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {skill.category}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  skill.priority === "high"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {skill.priority}
                              </Badge>
                              <Badge variant="outline">{skill.difficulty}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Learning Path</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {roadmap.skillGap.learningPath.map((step, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="font-mono text-primary">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="courses" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {roadmap.recommendedCourses.map((course) => (
                  <Card key={course.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{course.name}</CardTitle>
                      <CardDescription>{course.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Course →
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {roadmap.recommendedProjects.map((project) => (
                  <Card key={project.name}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <Badge variant="outline">{project.difficulty}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
