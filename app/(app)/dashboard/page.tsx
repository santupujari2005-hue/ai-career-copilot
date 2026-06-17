import Link from "next/link";
import {
  FileText,
  Target,
  TrendingUp,
  Upload,
  Map,
  ArrowRight,
} from "lucide-react";
import { getDashboardData } from "@/actions/user";
import { formatDate, getScoreColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScoreChart, SkillsChart } from "@/components/dashboard/charts";

export default async function DashboardPage() {
  const data = await getDashboardData();

  const skillsByCategory = data.missingSkills.reduce(
    (acc, skill) => {
      const cat = skill.category || "General";
      if (!acc[cat]) acc[cat] = { completed: 0, total: 0 };
      acc[cat].total++;
      return acc;
    },
    {} as Record<string, { completed: number; total: number }>
  );

  if (data.completedSkillsCount > 0) {
    Object.keys(skillsByCategory).forEach((cat) => {
      skillsByCategory[cat].completed = Math.min(1, skillsByCategory[cat].total);
    });
  }

  const chartData = Object.entries(skillsByCategory).map(([name, stats]) => ({
    name,
    ...stats,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your career progress and AI insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(data.resumeScore ?? 0)}`}>
              {data.resumeScore ?? "—"}
              {data.resumeScore !== null && "/100"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.latestResume
                ? `Updated ${formatDate(data.latestResume.createdAt)}`
                : "Upload a resume to get started"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Roadmap Progress</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.roadmapProgress}%</div>
            <Progress value={data.roadmapProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Missing Skills</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.missingSkills.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Skills to develop
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Skills</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completedSkillsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Skills mastered
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Resume Score</CardTitle>
            <CardDescription>Your latest resume analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {data.resumeScore !== null ? (
              <ScoreChart score={data.resumeScore} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No resume analyzed yet</p>
                <Button asChild>
                  <Link href="/upload">Upload Resume</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
            <CardDescription>Progress by category</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillsChart data={chartData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Missing Skills</CardTitle>
            <CardDescription>Prioritized learning targets</CardDescription>
          </CardHeader>
          <CardContent>
            {data.missingSkills.length > 0 ? (
              <div className="space-y-3">
                {data.missingSkills.slice(0, 8).map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {skill.category}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={skill.priority >= 2 ? "destructive" : "secondary"}>
                        P{skill.priority}
                      </Badge>
                      <Badge variant="outline">{skill.difficulty}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Upload and analyze a resume to identify skill gaps.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Projects</CardTitle>
            <CardDescription>Build these to strengthen your profile</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recommendedProjects.length > 0 ? (
              <ul className="space-y-2">
                {data.recommendedProjects.slice(0, 6).map((project, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg border p-3 text-sm"
                  >
                    <span className="font-mono text-primary">{i + 1}.</span>
                    {project}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                Projects will appear after resume analysis.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {data.latestRoadmap && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{data.latestRoadmap.title}</CardTitle>
              <CardDescription>
                Target: {data.latestRoadmap.targetRole}
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/roadmap">
                View Roadmap
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Progress value={data.latestRoadmap.progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {data.latestRoadmap.progress}% complete
            </p>
          </CardContent>
        </Card>
      )}

      {data.progressHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your career progress timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.progressHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.type}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
