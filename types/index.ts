export const TARGET_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "AI Engineer",
  "Data Scientist",
  "DevOps Engineer",
] as const;

export type TargetRole = (typeof TARGET_ROLES)[number];

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  atsSuggestions: string[];
  recommendedProjects: string[];
  interviewTips: string[];
  currentSkills: string[];
}

export interface RoadmapContent {
  title: string;
  targetRole: string;
  thirtyDayPlan: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
  weeklyMilestones: string[];
  requiredSkills: string[];
  recommendedCourses: {
    name: string;
    provider: string;
    url: string;
  }[];
  recommendedProjects: {
    name: string;
    description: string;
    difficulty: string;
  }[];
}

export interface SkillGapAnalysis {
  missingSkills: {
    name: string;
    priority: "high" | "medium" | "low";
    difficulty: "beginner" | "intermediate" | "advanced";
    category: string;
  }[];
  matchingSkills: string[];
  learningPath: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category?: string;
  context?: string;
}

export interface InterviewQuestions {
  technicalQuestions: InterviewQuestion[];
  hrQuestions: InterviewQuestion[];
  projectQuestions: InterviewQuestion[];
}

export interface InterviewEvaluation {
  communicationScore: number;
  technicalScore: number;
  overallScore: number;
  feedback: string[];
  strengths: string[];
  improvements: string[];
  questionFeedback: {
    questionId: string;
    score: number;
    feedback: string;
  }[];
}

export interface DashboardStats {
  resumeScore: number | null;
  latestResume: {
    id: string;
    fileName: string;
    score: number | null;
    createdAt: Date;
  } | null;
  roadmapProgress: number;
  missingSkillsCount: number;
  completedSkillsCount: number;
  recommendedProjects: string[];
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  resumeCount: number;
  roadmapCount: number;
  interviewCount: number;
}
