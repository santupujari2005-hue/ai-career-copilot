import type {
  InterviewEvaluation,
  InterviewQuestions,
  ResumeAnalysis,
  RoadmapContent,
  SkillGapAnalysis,
} from "@/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

async function callOpenAI<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  // If the assistant returned an object already, return it directly.
  if (typeof content !== "string") {
    return content as T;
  }

  try {
    return JSON.parse(content) as T;
  } catch (e) {
    // If parsing fails, return the raw content wrapped where appropriate or throw a clearer error
    throw new Error(`Failed to parse OpenAI response as JSON: ${e instanceof Error ? e.message : String(e)}; content=${content.slice(0,200)}`);
  }
}

export async function analyzeResume(
  resumeText: string,
  targetRole?: string
): Promise<ResumeAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      score: 80,
      strengths: ["JavaScript", "React"],
      weaknesses: ["Docker"],
      missingSkills: ["Docker", "CI/CD"],
      atsSuggestions: ["Add keywords"],
      recommendedProjects: ["Portfolio website"],
      interviewTips: ["Be concise"],
      currentSkills: ["HTML", "CSS", "JavaScript"],
    } as ResumeAnalysis;
  }
  const systemPrompt = `You are an expert career coach and ATS specialist. Analyze resumes and return structured JSON with this exact schema:
{
  "score": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "missingSkills": string[],
  "atsSuggestions": string[],
  "recommendedProjects": string[],
  "interviewTips": string[],
  "currentSkills": string[]
}`;

  const userPrompt = `Analyze this resume${targetRole ? ` for a ${targetRole} role` : ""}:

${resumeText.slice(0, 12000)}`;

  try {
    return await callOpenAI<ResumeAnalysis>(systemPrompt, userPrompt);
  } catch (e) {
    console.warn("OpenAI analyzeResume failed, falling back to mock:", e);
    return {
      score: 80,
      strengths: ["JavaScript", "React"],
      weaknesses: ["Docker"],
      missingSkills: ["Docker", "CI/CD"],
      atsSuggestions: ["Add keywords"],
      recommendedProjects: ["Portfolio website"],
      interviewTips: ["Be concise"],
      currentSkills: ["HTML", "CSS", "JavaScript"],
    } as ResumeAnalysis;
  }
}

export async function generateRoadmap(
  targetRole: string,
  currentSkills: string[]
): Promise<RoadmapContent> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      title: `${targetRole} Roadmap`,
      targetRole,
      thirtyDayPlan: { week1: ["Learn basics"], week2: ["Build project"], week3: ["Learn advanced"], week4: ["Deploy"] },
      weeklyMilestones: ["M1", "M2"],
      requiredSkills: ["JavaScript", "React"],
      recommendedCourses: [{ name: "Intro to React", provider: "Free", url: "" }],
      recommendedProjects: [{ name: "Todo App", description: "Build a todo app", difficulty: "beginner" }],
    } as RoadmapContent;
  }
  const systemPrompt = `You are a career roadmap expert. Generate a comprehensive 30-day career roadmap as JSON with this exact schema:
{
  "title": string,
  "targetRole": string,
  "thirtyDayPlan": { "week1": string[], "week2": string[], "week3": string[], "week4": string[] },
  "weeklyMilestones": string[],
  "requiredSkills": string[],
  "recommendedCourses": { "name": string, "provider": string, "url": string }[],
  "recommendedProjects": { "name": string, "description": string, "difficulty": string }[]
}`;

  const userPrompt = `Create a 30-day career roadmap for becoming a ${targetRole}.
Current skills: ${currentSkills.length > 0 ? currentSkills.join(", ") : "Not specified"}`;

  try {
    return await callOpenAI<RoadmapContent>(systemPrompt, userPrompt);
  } catch (e) {
    console.warn("OpenAI generateRoadmap failed, falling back to mock:", e);
    return {
      title: `${targetRole} Roadmap`,
      targetRole,
      thirtyDayPlan: { week1: ["Learn basics"], week2: ["Build project"], week3: ["Learn advanced"], week4: ["Deploy"] },
      weeklyMilestones: ["M1", "M2"],
      requiredSkills: ["JavaScript", "React"],
      recommendedCourses: [{ name: "Intro to React", provider: "Free", url: "" }],
      recommendedProjects: [{ name: "Todo App", description: "Build a todo app", difficulty: "beginner" }],
    } as RoadmapContent;
  }
}

export async function generateInterviewQuestions(
  role: string,
  resumeText?: string
): Promise<InterviewQuestions> {
  if (process.env.NODE_ENV !== "production" || !process.env.OPENAI_API_KEY) {
    return {
      technicalQuestions: [
        { id: "t1", question: "What is React?", category: "react" },
      ],
      hrQuestions: [{ id: "h1", question: "Tell me about yourself" }],
      projectQuestions: [{ id: "p1", question: "Describe a project you built", context: "" }],
    } as InterviewQuestions;
  }
  const systemPrompt = `You are an interview coach. Generate interview questions as JSON with this exact schema:
{
  "technicalQuestions": { "id": string, "question": string, "category": string }[],
  "hrQuestions": { "id": string, "question": string }[],
  "projectQuestions": { "id": string, "question": string, "context": string }[]
}
Generate 5 technical, 5 HR, and 3 project-based questions.`;

  const userPrompt = `Generate interview questions for a ${role} position.${
    resumeText ? `\n\nCandidate resume:\n${resumeText.slice(0, 6000)}` : ""
  }`;

  try {
    return await callOpenAI<InterviewQuestions>(systemPrompt, userPrompt);
  } catch (e) {
    console.warn("OpenAI generateInterviewQuestions failed, falling back to mock:", e);
    return {
      technicalQuestions: [
        { id: "t1", question: "What is React?", category: "react" },
      ],
      hrQuestions: [{ id: "h1", question: "Tell me about yourself" }],
      projectQuestions: [{ id: "p1", question: "Describe a project you built", context: "" }],
    } as InterviewQuestions;
  }
}

export async function evaluateInterviewAnswers(
  role: string,
  questions: InterviewQuestions,
  answers: Record<string, string>
): Promise<InterviewEvaluation> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      communicationScore: 80,
      technicalScore: 75,
      overallScore: 78,
      feedback: ["Good"],
      strengths: ["Communication"],
      improvements: ["Depth"],
      questionFeedback: [],
    } as InterviewEvaluation;
  }
  const systemPrompt = `You are an interview evaluator. Evaluate candidate answers and return JSON with this exact schema:
{
  "communicationScore": number (0-100),
  "technicalScore": number (0-100),
  "overallScore": number (0-100),
  "feedback": string[],
  "strengths": string[],
  "improvements": string[],
  "questionFeedback": { "questionId": string, "score": number, "feedback": string }[]
}`;

  const qaPairs = [
    ...questions.technicalQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: answers[q.id] || "No answer provided",
    })),
    ...questions.hrQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: answers[q.id] || "No answer provided",
    })),
    ...questions.projectQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: answers[q.id] || "No answer provided",
    })),
  ];

  const userPrompt = `Evaluate these interview answers for a ${role} position:

${JSON.stringify(qaPairs, null, 2)}`;

  try {
    return await callOpenAI<InterviewEvaluation>(systemPrompt, userPrompt);
  } catch (e) {
    console.warn("OpenAI evaluateInterviewAnswers failed, falling back to mock:", e);
    return {
      communicationScore: 80,
      technicalScore: 75,
      overallScore: 78,
      feedback: ["Good"],
      strengths: ["Communication"],
      improvements: ["Depth"],
      questionFeedback: [],
    } as InterviewEvaluation;
  }
}

export async function analyzeSkillGap(
  currentSkills: string[],
  targetRole: string
): Promise<SkillGapAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      missingSkills: currentSkills.length ? [] : [{ name: "JavaScript", priority: "high", difficulty: "beginner", category: "frontend" }],
      matchingSkills: currentSkills,
      learningPath: ["Start with basics"],
    } as SkillGapAnalysis;
  }
  const systemPrompt = `You are a skills analyst. Compare current skills vs target career and return JSON with this exact schema:
{
  "missingSkills": { "name": string, "priority": "high" | "medium" | "low", "difficulty": "beginner" | "intermediate" | "advanced", "category": string }[],
  "matchingSkills": string[],
  "learningPath": string[]
}`;

  const userPrompt = `Target role: ${targetRole}
Current skills: ${currentSkills.join(", ") || "None specified"}`;

  try {
    return await callOpenAI<SkillGapAnalysis>(systemPrompt, userPrompt);
  } catch (e) {
    console.warn("OpenAI analyzeSkillGap failed, falling back to mock:", e);
    return {
      missingSkills: currentSkills.length ? [] : [{ name: "JavaScript", priority: "high", difficulty: "beginner", category: "frontend" }],
      matchingSkills: currentSkills,
      learningPath: ["Start with basics"],
    } as SkillGapAnalysis;
  }
}
