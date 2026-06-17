import type { ResumeAnalysis } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { saveUploadedFile, getFilePathFromUrl } from "@/lib/upload";
import { extractTextFromPdf } from "@/lib/pdf";
import { analyzeResume as analyzeResumeAI } from "@/lib/openai";
import { resumeAnalyzeSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file") as File | null;
    const targetRole = form.get("targetRole")?.toString();

    const parsed = resumeAnalyzeSchema.safeParse({ resumeId: undefined, targetRole });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save file and extract text
    const { fileUrl, fileName } = await saveUploadedFile(file, session.user.id);
    const filePath = getFilePathFromUrl(fileUrl);
    const extractedText = await extractTextFromPdf(filePath);

    // Call AI service
    const analysis = (await analyzeResumeAI(extractedText, targetRole)) as ResumeAnalysis;

    // Persist resume + analysis
    const resume = await prisma.resume.create({
      data: {
        fileName,
        fileUrl,
        extractedText,
        score: Math.round(analysis.score ?? 0),
        feedback: analysis as unknown as Prisma.InputJsonValue,
        userId: session.user.id,
      },
    });

    // Upsert skills based on analysis (best-effort, non-blocking)
    (async () => {
      try {
        const current = analysis.currentSkills ?? [];
        const missing = analysis.missingSkills ?? [];

        for (const s of current) {
          const skill = await prisma.skill.upsert({ where: { name: s }, update: {}, create: { name: s, category: "general" } });
          await prisma.userSkill.upsert({
            where: { skillId_userId: { skillId: skill.id, userId: session.user.id } },
            update: { completed: true },
            create: { skillId: skill.id, userId: session.user.id, completed: true },
          });
        }

        for (const s of missing) {
          const skill = await prisma.skill.upsert({ where: { name: s }, update: {}, create: { name: s, category: "general" } });
          await prisma.userSkill.upsert({
            where: { skillId_userId: { skillId: skill.id, userId: session.user.id } },
            update: { completed: false },
            create: { skillId: skill.id, userId: session.user.id, completed: false },
          });
        }
      } catch (e) {
        console.warn("Non-fatal: skill upsert failed", e);
      }
    })();

    return NextResponse.json({ resume, analysis });
  } catch (error) {
    console.error("Resume analyze error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Analysis failed" }, { status: 500 });
  }
}