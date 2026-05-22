import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { SeverityBadge } from "@/components/app/SeverityBadge";
import { QuoteBlock } from "@/components/app/QuoteBlock";
import { Loader2, ChevronDown, ChevronUp, RotateCcw, MessageSquare, BookOpen, Link2 } from "lucide-react";
import { motion } from "framer-motion";

type SimulatorState = "setup" | "results";

const MOCK_QUESTIONS = [
  {
    id: "q1",
    number: 1,
    question: "Ms. Martinez, isn't it true that you frequently deny Mr. Thompson access to the children beyond the court order?",
    whyMatters: "Opposing counsel may use this to establish a pattern of interference and challenge your willingness to support the children's relationship with their father.",
    triggeringEvidence: "Scheduling dispute — May 14 text thread",
    strategy: "Answer calmly and factually. Reference the parenting plan and provide specific dates you complied. If there were denials, explain the safety context. Do not become defensive.",
    followUp: "Can you explain a specific instance where you denied parenting time outside of a documented safety concern?",
    riskScore: 7
  },
  {
    id: "q2",
    number: 2,
    question: "Why did you fail to notify Mr. Thompson about Sofia's school enrollment change at Westchase Elementary in September 2025?",
    whyMatters: "This tests your compliance with joint decision-making provisions and your transparency regarding the children's education.",
    triggeringEvidence: "School enrollment — unauthorized change letter",
    strategy: "Clarify the timeline. State who made the initial enrollment decision, what notice was provided, and what the current arrangement is. Bring school records showing both parents' involvement.",
    followUp: "What is your understanding of joint educational decision-making under the current parenting plan?",
    riskScore: 5
  },
  {
    id: "q3",
    number: 3,
    question: "How do you respond to Mr. Thompson's claim that you use the children as messengers to communicate his schedule changes?",
    whyMatters: "Using children as messengers is viewed negatively by courts and reflects on your willingness to co-parent appropriately.",
    triggeringEvidence: "Communication pattern — 23 hostile message incidents",
    strategy: "Deny if untrue and explain your communication method (OurFamilyWizard, text, email). Reference the documented non-response patterns that have made direct communication difficult.",
    followUp: "Can you describe your preferred method of communicating schedule changes with Mr. Thompson?",
    riskScore: 4
  },
  {
    id: "q4",
    number: 4,
    question: "You've stated that Mr. Thompson is non-responsive. Were there any extended periods where you also did not respond to his messages?",
    whyMatters: "Opposing counsel may attempt to establish mutual communication failures to neutralize your evidence.",
    triggeringEvidence: "33-hour non-response — fever notification April 2",
    strategy: "Acknowledge any delayed responses with context. Focus on the asymmetry: your delays versus his 33-hour non-response to a medical emergency. Let the numbers speak.",
    followUp: "What is the longest you have gone without responding to a message from Mr. Thompson?",
    riskScore: 6
  },
  {
    id: "q5",
    number: 5,
    question: "Has there been any period where Sofia or Lucas expressed a preference to spend more time with Mr. Thompson?",
    whyMatters: "Child preference is one of the statutory factors. If the children have expressed contrary preferences, this must be addressed.",
    triggeringEvidence: "Children's Preferences — only 1 weak evidence entry",
    strategy: "Answer honestly. If you are aware of preferences, state them accurately. If not, say so. Courts value candid, child-centered testimony over advocacy.",
    followUp: "How do you typically gauge what your children want in terms of time with each parent?",
    riskScore: 8
  }
];

const ISSUE_FILTERS = ["All Issues", "Scheduling", "Communication", "Financial", "Co-Parenting", "Safety"];

export default function CourtSimulator() {
  const [simState, setSimState] = useState<SimulatorState>("setup");
  const [generating, setGenerating] = useState(false);
  const [role, setRole] = useState<"asked" | "asking">("asked");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("All Issues");

  function toggleExpand(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  }

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setSimState("results"); }, 1800);
  }

  if (simState === "setup") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold">Court Simulator</h1>
          <p className="text-sm text-muted-foreground mt-1">Prepare for court questions based on your evidence.</p>
        </motion.div>

        <DisclaimerBanner />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Question Type</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <button
              className={`p-4 rounded-xl border text-left transition-all ${role === "asked" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"}`}
              onClick={() => setRole("asked")}
              data-testid="option-questions-asked"
            >
              <p className="font-medium text-sm">Questions I may be asked</p>
              <p className="text-xs text-muted-foreground mt-1">Prepare defenses and responses to opposing counsel</p>
            </button>
            <button
              className={`p-4 rounded-xl border text-left transition-all ${role === "asking" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"}`}
              onClick={() => setRole("asking")}
              data-testid="option-questions-asking"
            >
              <p className="font-medium text-sm">Questions I would ask</p>
              <p className="text-xs text-muted-foreground mt-1">Cross-examination questions for the other party</p>
            </button>
          </CardContent>
        </Card>

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Filter by issue</p>
          <div className="flex flex-wrap gap-2">
            {ISSUE_FILTERS.map((f) => (
              <button
                key={f}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"}`}
                onClick={() => setFilter(f)}
                data-testid={`filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Card className="bg-muted/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Ready to generate</p>
              <p className="text-xs text-muted-foreground">5 questions based on your evidence and filters</p>
            </div>
            <span className="text-2xl font-bold text-primary">5</span>
          </CardContent>
        </Card>

        <Button className="w-full h-11 text-base" onClick={handleGenerate} disabled={generating} data-testid="button-generate-questions">
          {generating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generating...</> : "Generate Questions"}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Court Questions</h1>
          <p className="text-sm text-muted-foreground">{MOCK_QUESTIONS.length} questions based on your evidence</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setSimState("setup")} data-testid="button-back-setup">
          <RotateCcw className="h-3.5 w-3.5" />
          New Simulation
        </Button>
      </motion.div>

      <DisclaimerBanner />

      <div className="space-y-4">
        {MOCK_QUESTIONS.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card data-testid={`question-card-${q.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                      Opposing Counsel Question #{q.number}
                    </span>
                    <p className="font-medium text-sm leading-snug">{q.question}</p>
                  </div>
                  <SeverityBadge score={q.riskScore} label="risk" />
                </div>

                <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Link2 className="h-3 w-3 shrink-0" />
                  <span className="font-medium">Triggering:</span>
                  <span>{q.triggeringEvidence}</span>
                </div>

                {expanded.has(q.id) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mb-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Why this matters</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{q.whyMatters}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Suggested response strategy</p>
                      <p className="text-xs leading-relaxed">{q.strategy}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-medium mb-1">Likely follow-up</p>
                      <p className="text-xs italic text-muted-foreground">"{q.followUp}"</p>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => toggleExpand(q.id)} data-testid={`button-expand-question-${q.id}`}>
                    {expanded.has(q.id) ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {expanded.has(q.id) ? "Less" : "Strategy + Details"}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" data-testid={`button-practice-${q.id}`}>
                    <MessageSquare className="h-3 w-3" />
                    Practice Answer
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" data-testid={`button-save-prep-${q.id}`}>
                    <BookOpen className="h-3 w-3" />
                    Save to Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
