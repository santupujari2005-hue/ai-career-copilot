"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { signUpSchema, profileSchema } from "@/lib/validations";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function signUpAction(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { success: true };
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireAuth();

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  const emailTaken = await prisma.user.findFirst({
    where: { email: parsed.data.email, NOT: { id: user.id } },
  });

  if (emailTaken) {
    return { error: "Email already in use" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function toggleSkillAction(skillName: string, completed: boolean) {
  const user = await requireAuth();

  const skill = await prisma.skill.upsert({
    where: { name: skillName },
    update: {},
    create: { name: skillName, category: "general" },
  });

  await prisma.userSkill.upsert({
    where: {
      skillId_userId: { skillId: skill.id, userId: user.id },
    },
    update: { completed },
    create: {
      skillId: skill.id,
      userId: user.id,
      completed,
    },
  });

  if (completed) {
    await prisma.careerProgress.create({
      data: {
        type: "skill",
        title: `Completed skill: ${skillName}`,
        userId: user.id,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { success: true };
}

export async function updateRoadmapProgressAction(
  roadmapId: string,
  progress: number
) {
  const user = await requireAuth();

  await prisma.roadmap.updateMany({
    where: { id: roadmapId, userId: user.id },
    data: { progress: Math.min(100, Math.max(0, progress)) },
  });

  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
  return { success: true };
}

export async function logProgressAction(
  type: "project" | "resume" | "skill",
  title: string,
  details?: Record<string, unknown>
) {
  const user = await requireAuth();

  await prisma.careerProgress.create({
    data: {
      type,
      title,
      details: details ? (details as Prisma.InputJsonValue) : undefined,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getDashboardData() {
  const user = await requireAuth();

  const [latestResume, roadmaps, userSkills, resumes] = await Promise.all([
    prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.roadmap.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 1,
    }),
    prisma.userSkill.findMany({
      where: { userId: user.id },
      include: { skill: true },
    }),
    prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const missingSkills = userSkills.filter((s) => !s.completed);
  const completedSkills = userSkills.filter((s) => s.completed);
  const latestRoadmap = roadmaps[0];

  let recommendedProjects: string[] = [];
  if (latestResume?.feedback) {
    const feedback = latestResume.feedback as { recommendedProjects?: string[] };
    recommendedProjects = feedback.recommendedProjects ?? [];
  }

  return {
    resumeScore: latestResume?.score ?? null,
    latestResume: latestResume
      ? {
          id: latestResume.id,
          fileName: latestResume.fileName,
          score: latestResume.score,
          createdAt: latestResume.createdAt,
        }
      : null,
    roadmapProgress: latestRoadmap?.progress ?? 0,
    missingSkills: missingSkills.map((s) => ({
      id: s.id,
      name: s.skill.name,
      priority: s.priority,
      difficulty: s.skill.difficulty,
      category: s.skill.category,
    })),
    completedSkillsCount: completedSkills.length,
    recommendedProjects,
    resumes,
    latestRoadmap,
    progressHistory: await prisma.careerProgress.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  };
}

export async function getUserProfileData() {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      _count: {
        select: {
          resumes: true,
          roadmaps: true,
          interviews: true,
        },
      },
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.image,
    createdAt: dbUser.createdAt,
    resumeCount: dbUser._count.resumes,
    roadmapCount: dbUser._count.roadmaps,
    interviewCount: dbUser._count.interviews,
  };
}
