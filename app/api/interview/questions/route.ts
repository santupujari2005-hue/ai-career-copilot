import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInterviewQuestions } from "@/lib/openai";
import { interviewQuestionsSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = interviewQuestionsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { role, resumeId } = parsed.data;

    let resumeText: string | undefined;
    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: session.user.id },
      });
      resumeText = resume?.extractedText ?? undefined;
    } else {
      const latestResume = await prisma.resume.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
      resumeText = latestResume?.extractedText ?? undefined;
    }

    const questions = await generateInterviewQuestions(role, resumeText);

    const interview = await prisma.interview.create({
      data: {
        role,
        questions: questions as unknown as Prisma.InputJsonValue,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ interview, questions });
  } catch (error) {
    console.error("Interview questions error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
