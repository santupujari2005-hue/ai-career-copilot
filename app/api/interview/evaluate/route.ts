import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateInterviewAnswers } from "@/lib/openai";
import { interviewEvaluateSchema } from "@/lib/validations";
import type { InterviewQuestions } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = interviewEvaluateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { interviewId, answers } = parsed.data;

    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId: session.user.id },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    const questions = interview.questions as unknown as InterviewQuestions;
    const evaluation = await evaluateInterviewAnswers(
      interview.role,
      questions,
      answers
    );

    const updated = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        answers,
        score: {
          communication: evaluation.communicationScore,
          technical: evaluation.technicalScore,
          overall: evaluation.overallScore,
        },
        feedback: evaluation as unknown as Prisma.InputJsonValue,
      },
    });

    await prisma.careerProgress.create({
      data: {
        type: "interview",
        title: `Interview practice - ${interview.role}`,
        details: { score: evaluation.overallScore },
        userId: session.user.id,
      },
    });

    return NextResponse.json({ interview: updated, evaluation });
  } catch (error) {
    console.error("Interview evaluate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Evaluation failed" },
      { status: 500 }
    );
  }
}
