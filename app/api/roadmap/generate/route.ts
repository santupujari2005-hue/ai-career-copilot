import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRoadmap, analyzeSkillGap } from "@/lib/openai";
import { roadmapGenerateSchema } from "@/lib/validations";
import type { RoadmapContent } from "@/types";

export async function POST(request: NextRequest) {
  try {
    let session: { user?: { id?: string } } | null = null;
    if (process.env.NODE_ENV !== "production" && request.headers.get("x-dev-user") === "true") {
      let devUser = await prisma.user.findFirst();
      if (!devUser) {
        devUser = await prisma.user.create({ data: { email: "dev@example.com", name: "Dev User" } });
      }
      session = { user: { id: devUser.id } };
    } else {
      session = await auth();
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = roadmapGenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { targetRole } = parsed.data;

    const userSkills = await prisma.userSkill.findMany({
      where: { userId: session.user.id, completed: true },
      include: { skill: true },
    });

    const currentSkills = userSkills.map((us) => us.skill.name);

    const latestResume = await prisma.resume.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (latestResume?.feedback) {
      const feedback = latestResume.feedback as { currentSkills?: string[] };
      if (feedback.currentSkills) {
        currentSkills.push(
          ...feedback.currentSkills.filter((s) => !currentSkills.includes(s))
        );
      }
    }

    const [roadmapContent, skillGap] = await Promise.all([
      generateRoadmap(targetRole, currentSkills),
      analyzeSkillGap(currentSkills, targetRole),
    ]);

    const enrichedContent: RoadmapContent & { skillGap: typeof skillGap } = {
      ...roadmapContent,
      skillGap,
    };

    const roadmap = await prisma.roadmap.create({
      data: {
        title: roadmapContent.title,
        targetRole,
        content: enrichedContent as unknown as Prisma.InputJsonValue,
        userId: session.user.id,
      },
    });

    for (const skill of skillGap.missingSkills) {
      const dbSkill = await prisma.skill.upsert({
        where: { name: skill.name },
        update: { difficulty: skill.difficulty, category: skill.category },
        create: {
          name: skill.name,
          category: skill.category,
          difficulty: skill.difficulty,
        },
      });

      const priority =
        skill.priority === "high" ? 3 : skill.priority === "medium" ? 2 : 1;

      await prisma.userSkill.upsert({
        where: {
          skillId_userId: { skillId: dbSkill.id, userId: session.user.id },
        },
        update: { priority },
        create: {
          skillId: dbSkill.id,
          userId: session.user.id,
          completed: false,
          priority,
        },
      });
    }

    return NextResponse.json({ roadmap, content: enrichedContent });
  } catch (error) {
    console.error("Roadmap generate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
