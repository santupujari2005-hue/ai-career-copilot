import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInterviewQuestions } from "@/lib/openai";
import { interviewQuestionsSchema } from "@/lib/validations";

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

    const raw = await request.text();
    console.log("/api/interview/questions raw body:", raw.slice(0, 200));
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch (e1) {
      // Attempt to clean common curl-escaping (backslashes before quotes)
      const cleaned = raw.replace(/\\(?=[\{"'])/g, "");
      console.log("/api/interview/questions cleaned body:", cleaned.slice(0, 200));
      try {
        body = JSON.parse(cleaned);
      } catch (e2) {
        console.error("Failed to parse request body as JSON:", e2);
        return NextResponse.json({ error: (e2 as Error).message }, { status: 400 });
      }
    }
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
