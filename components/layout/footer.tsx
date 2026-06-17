import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Career Copilot
            </Link>
            <p className="text-sm text-muted-foreground">
              Your AI-powered career companion for resume analysis, skill gaps,
              roadmaps, and interview prep.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/signup" className="hover:text-foreground">Resume Analyzer</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Career Roadmap</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Interview Coach</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Skill Gap Analysis</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">About</Link></li>
              <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
              <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Career Copilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
