import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { EvidenceCard } from "@/components/app/EvidenceCard";
import { CheckCircle2, ChevronDown, ChevronUp, Save, GitBranch, FileSearch } from "lucide-react";
import { motion } from "framer-motion";
import { mockEvidenceEntries } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function AnalysisResults() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);

  const entries = mockEvidenceEntries.slice(0, 6);

  function handleSaveAll() {
    setSaved(true);
    toast({ title: "All 6 entries saved", description: "Evidence added to your library." });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Found {entries.length} Evidence Entries</h1>
            <p className="text-sm text-muted-foreground">AI extracted these from your text, calibrated for Florida custody factors</p>
          </div>
        </div>
      </motion.div>

      <DisclaimerBanner />

      {saved && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">6 evidence entries saved to your library.</p>
        </motion.div>
      )}

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <EvidenceCard entry={entry} />
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors rounded-xl"
            onClick={() => setSourceOpen(!sourceOpen)}
            data-testid="button-toggle-source"
          >
            <span>View Source Preview</span>
            {sourceOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {sourceOpen && (
            <div className="px-4 pb-4">
              <div className="bg-muted rounded-lg p-4 text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {`[2026-05-12 17:02] David: I'll be there when I get there. Stop texting me.
[2026-05-12 17:45] Maria: Sofia is still waiting. Please respond.
[2026-05-12 18:58] David: Just arrived.
[2026-05-10 21:14] Maria: We need to split the summer camp costs. Can we discuss?
[2026-05-10 21:47] David: You always ruin everything for them. This is why we're here.
[2026-04-02 21:14] Maria: Sofia has a 103 fever. She needs to see the doctor tomorrow. Please respond.
[2026-04-04 18:20] David: I was busy. She's fine.`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-20 md:bottom-6 bg-background/95 backdrop-blur border border-border rounded-xl p-3 flex flex-wrap gap-2 shadow-lg">
        <Button
          className="flex-1 gap-1.5"
          onClick={handleSaveAll}
          disabled={saved}
          data-testid="button-save-all"
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved" : `Save All (${entries.length})`}
        </Button>
        <Button variant="outline" className="gap-1.5" onClick={() => setLocation("/analyze/gaps")} data-testid="button-gap-detector">
          <GitBranch className="h-4 w-4" />
          Run Gap Detector
        </Button>
        <Button variant="outline" className="gap-1.5" data-testid="button-view-source">
          <FileSearch className="h-4 w-4" />
          View Source
        </Button>
      </div>
    </div>
  );
}
