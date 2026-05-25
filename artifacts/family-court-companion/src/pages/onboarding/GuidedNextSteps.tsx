import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MessageSquare, Search, HelpCircle, FileText, Layers, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    step: 1,
    title: "Upload & Analyze Evidence",
    description: "Upload documents, screenshots, or paste text. AI extracts and categorizes evidence entries relevant to your case factors.",
    tip: "Start with any text messages, emails, or documents you already have.",
    href: "/evidence/upload"
  },
  {
    icon: MessageSquare,
    step: 2,
    title: "Scan Communications",
    description: "Import message threads and let AI identify every evidentiary statement, pattern, or incident.",
    tip: "Export iMessage or WhatsApp threads as text files for best results.",
    href: "/analyze/scanner"
  },
  {
    icon: Search,
    step: 3,
    title: "Find Gaps in Your Case",
    description: "See which legal factors are covered, weak, or missing. Get a collection plan for what evidence to gather next.",
    tip: "Run this after uploading your first batch of evidence.",
    href: "/analyze/gaps"
  },
  {
    icon: HelpCircle,
    step: 4,
    title: "Prepare for Court Questions",
    description: "Generate questions you may be asked, along with strategy guidance and risk levels.",
    tip: "Focus on high-risk questions first.",
    href: "/analyze/simulator"
  },
  {
    icon: FileText,
    step: 5,
    title: "Generate Legal Documents",
    description: "Draft a case narrative, motion, declaration, or parenting plan based on your evidence. Always review with your attorney.",
    tip: "All drafts require attorney review before filing.",
    href: "/documents"
  },
  {
    icon: Layers,
    step: 6,
    title: "Organize & Present",
    description: "Build a court packet with labeled exhibits, cover page, and table of contents. Generate a formatted PDF.",
    tip: "Include only your strongest 3-8 exhibits.",
    href: "/packet/binder"
  }
];

export default function GuidedNextSteps() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="max-w-lg mx-auto w-full p-6">
        <div className="flex items-center gap-1.5 mb-8">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-1.5 rounded-full flex-1 bg-primary" />
          ))}
          <span className="text-xs text-muted-foreground ml-2 shrink-0">5/5</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold mb-1">Welcome, Maria!</h1>
          <p className="text-muted-foreground text-sm mb-8">Here's how to use CaseClear. Work through these steps in order for best results.</p>
        </motion.div>

        <div className="space-y-3 mb-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
              >
                <Card className="hover:border-primary/50 transition-colors" data-testid={`step-card-${step.step}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-muted-foreground">STEP {step.step}</span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{step.description}</p>
                        <p className="text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded">Tip: {step.tip}</p>
                      </div>
                      <button
                        className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        onClick={() => setLocation(step.href)}
                        data-testid={`button-open-step-${step.step}`}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => setLocation("/evidence/upload")} data-testid="button-start-evidence">
            Start with Evidence
          </Button>
          <Button variant="outline" onClick={() => setLocation("/home")} data-testid="button-go-dashboard">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
