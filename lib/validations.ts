import { z } from "zod";
import { TARGET_ROLES } from "@/types";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export const resumeAnalyzeSchema = z.object({
  resumeId: z.string().optional(),
  targetRole: z.enum(TARGET_ROLES as unknown as [string, ...string[]]).optional(),
});

export const roadmapGenerateSchema = z.object({
  targetRole: z.enum(TARGET_ROLES as unknown as [string, ...string[]]),
});

export const interviewQuestionsSchema = z.object({
  role: z.enum(TARGET_ROLES as unknown as [string, ...string[]]),
  resumeId: z.string().optional(),
});

export const interviewEvaluateSchema = z.object({
  interviewId: z.string(),
  answers: z.record(z.string(), z.string()),
});

export const skillToggleSchema = z.object({
  skillName: z.string().min(1),
  completed: z.boolean(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
