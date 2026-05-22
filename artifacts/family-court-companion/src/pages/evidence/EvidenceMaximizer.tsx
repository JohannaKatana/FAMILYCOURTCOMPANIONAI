import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCard } from "@/components/app/UploadCard";

type AnalysisState = "idle" | "uploading" | "analyzing" | "done";

export default function EvidenceMaximizer() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AnalysisState>("idle");
  const [text, setText] = useState("");
  const [contextOpen, setContextOpen] = useState(false);

  function handleAnalyze() {
    if (!text.trim()) return;
    setState("uploading");
    setTimeout(() => setState("analyzing"), 1200);
    setTimeout(() => {
      setState("done");
      setLocation("/evidence/results");
    }, 3200);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Evidence Maximizer</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload anything — AI finds what judges care about</p>
      </motion.div>

      <UploadCard
        label="Choose File"
        description="PDF, DOC, DOCX, TXT, JPG, PNG — up to 25 MB"
      />

      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-background px-3 text-xs text-muted-foreground">or paste text</span>
        </div>
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder="Paste your messages, emails, court documents, or any relevant text here. AI will extract evidence entries calibrated for your jurisdiction's custody factors."
          className="min-h-[180px] resize-y text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          data-testid="textarea-evidence-text"
        />

        <Card className="border-dashed">
          <CardContent className="p-0">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setContextOpen(!contextOpen)}
              data-testid="button-toggle-context"
            >
              <span>Add context or notes <span className="text-xs">(optional)</span></span>
              {contextOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {contextOpen && (
              <div className="px-4 pb-3">
                <Textarea
                  placeholder="What should the AI know? e.g. 'This is from a group chat. The other party is David Thompson.'"
                  className="min-h-[80px] text-sm"
                  data-testid="textarea-context"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <Button
              className="w-full h-11 text-base"
              disabled={!text.trim()}
              onClick={handleAnalyze}
              data-testid="button-analyze-evidence"
            >
              Analyze Evidence
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <span className="text-primary cursor-pointer hover:underline">See guide</span> — learn what evidence works best
            </p>
          </motion.div>
        )}

        {state === "uploading" && (
          <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="font-medium text-sm">Reading your document...</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "45%" }} transition={{ duration: 1.2 }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="font-semibold text-sm">AI is analyzing your document...</p>
                <p className="text-xs text-muted-foreground text-center">Extracting evidence entries, scoring relevance, and mapping to Florida custody factors</p>
                <div className="w-full space-y-1.5 text-xs text-muted-foreground">
                  {["Parsing text content", "Identifying evidentiary statements", "Scoring factor relevance", "Extracting direct quotes"].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-muted/50 rounded-xl p-4 text-xs text-muted-foreground flex items-start gap-2">
        <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p>Your data is encrypted and private to your account. It is never sold, shared, or used to train AI models.</p>
      </div>
    </div>
  );
}
