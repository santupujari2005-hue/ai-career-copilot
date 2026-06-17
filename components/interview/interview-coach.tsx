"use client";

import { useState } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { TARGET_ROLES } from "@/types";
import type { InterviewQuestions, InterviewEvaluation } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn, getScoreColor } from "@/lib/utils";

export function InterviewCoach() {
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);

  const handleGenerate = async () => {
    if (!role) return;

    setLoading(true);
    setError(null);
    setEvaluation(null);
    setAnswers({});

    try {
      const res = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      setInterviewId(data.interview.id);
      setQuestions(data.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!interviewId || !questions) return;

    setEvaluating(true);
    setError(null);

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId, answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed");
      }

      setEvaluation(data.evaluation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setEvaluating(false);
    }
  };

  const allQuestions = questions
    ? [
        ...questions.technicalQuestions,
        ...questions.hrQuestions,
        ...questions.projectQuestions,
      ]
    : [];

  const answeredCount = allQuestions.filter(
    (q) => answers[q.id]?.trim()
  ).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Start Interview Practice</CardTitle>
          <CardDescription>
            Select a role to generate tailored interview questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select interview role" />
            </SelectTrigger>
            <SelectContent>
              {TARGET_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
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
            disabled={!role || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating questions...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {questions && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {answeredCount} of {allQuestions.length} questions answered
            </p>
            <Progress
              value={(answeredCount / allQuestions.length) * 100}
              className="w-32"
            />
          </div>

          <Tabs defaultValue="technical">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="technical">
                Technical ({questions.technicalQuestions.length})
              </TabsTrigger>
              <TabsTrigger value="hr">
                HR ({questions.hrQuestions.length})
              </TabsTrigger>
              <TabsTrigger value="project">
                Project ({questions.projectQuestions.length})
              </TabsTrigger>
            </TabsList>

            {(
              [
                ["technical", questions.technicalQuestions],
                ["hr", questions.hrQuestions],
                ["project", questions.projectQuestions],
              ] as const
            ).map(([tab, qs]) => (
              <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
                {qs.map((q, i) => (
                  <Card key={q.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-base font-medium">
                          Q{i + 1}. {q.question}
                        </CardTitle>
                        {q.category && (
                          <Badge variant="outline">{q.category}</Badge>
                        )}
                      </div>
                      {q.context && (
                        <CardDescription>{q.context}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Type your answer here..."
                        value={answers[q.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>

          <Button
            onClick={handleEvaluate}
            disabled={evaluating || answeredCount === 0}
            className="w-full"
            size="lg"
          >
            {evaluating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Evaluating answers...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit for AI Evaluation
              </>
            )}
          </Button>
        </>
      )}

      {evaluation && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Results</CardTitle>
              <CardDescription>AI assessment of your interview performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Communication", score: evaluation.communicationScore },
                  { label: "Technical", score: evaluation.technicalScore },
                  { label: "Overall", score: evaluation.overallScore },
                ].map(({ label, score }) => (
                  <div key={label} className="text-center rounded-lg border p-4">
                    <div className={cn("text-3xl font-bold", getScoreColor(score))}>
                      {score}
                    </div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                    <Progress value={score} className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-green-600 dark:text-green-400">
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="text-sm">• {s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluation.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {evaluation.feedback.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluation.feedback.map((f, i) => (
                    <li key={i} className="text-sm">{f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
