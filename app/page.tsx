import Link from "next/link";
import {
  FileSearch,
  Map,
  MessageSquare,
  Target,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { LandingNav } from "@/components/layout/landing-nav";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: FileSearch,
    title: "Resume Analyzer",
    description:
      "Upload your PDF resume and get AI-powered scoring, ATS optimization tips, and actionable feedback.",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    description:
      "Generate personalized 30-day plans with weekly milestones, courses, and project recommendations.",
  },
  {
    icon: MessageSquare,
    title: "Interview Coach",
    description:
      "Practice technical, HR, and project-based questions with AI evaluation and detailed feedback.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description:
      "Compare your current skills against target roles and get prioritized learning paths.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    content:
      "The resume analyzer helped me improve my ATS score from 62 to 89. I landed 3 interviews in two weeks!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Full Stack Engineer",
    content:
      "The 30-day roadmap was exactly what I needed to transition from backend to full stack development.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist",
    content:
      "Interview coach gave me confidence. The AI feedback on my answers was incredibly detailed and helpful.",
    rating: 5,
  },
];

const benefits = [
  "AI-powered resume scoring (0-100)",
  "Personalized career roadmaps",
  "Skill gap analysis with priorities",
  "Mock interview with AI evaluation",
  "Progress tracking dashboard",
  "Dark mode support",
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />

      <main className="flex-1">
        <section className="hero-gradient py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm mb-6 backdrop-blur">
              <Star className="h-4 w-4 text-primary fill-primary" />
              Trusted by 10,000+ job seekers
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Build Your Career
              <br />
              <span className="gradient-text">With AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Analyze your resume, discover skill gaps, generate career roadmaps,
              and ace interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From resume optimization to interview preparation, our AI tools
                guide you every step of the way.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="card-hover">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Choose AI Career Copilot?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our platform combines cutting-edge AI with career expertise to
                  give you a competitive edge in today&apos;s job market.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8" asChild>
                  <Link href="/signup">Start Free Today</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-1">89%</div>
                  <div className="text-sm text-muted-foreground">Avg. Resume Score Improvement</div>
                </Card>
                <Card className="p-6 text-center mt-8">
                  <div className="text-4xl font-bold text-primary mb-1">30</div>
                  <div className="text-sm text-muted-foreground">Day Career Plans</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Interview Questions</div>
                </Card>
                <Card className="p-6 text-center mt-8">
                  <div className="text-4xl font-bold text-primary mb-1">6</div>
                  <div className="text-sm text-muted-foreground">Career Paths Supported</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Loved by Job Seekers
              </h2>
              <p className="text-muted-foreground">
                See what our users have to say about their career transformation.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="card-hover">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of professionals using AI to land their dream jobs.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
