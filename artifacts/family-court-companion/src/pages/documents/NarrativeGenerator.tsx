import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { Loader2, Edit, Copy, Download, Save, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { mockFloridaCase, mockNarrativeDraft } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const ISSUE_THEMES = ["Scheduling violations", "Communication failures", "Unilateral decisions", "Financial non-compliance", "Medical non-disclosure", "Court order violations"];
const EVIDENCE_OPTIONS = ["Late pickup — May 12", "Medical non-disclosure", "Hostile text exchange", "Unilateral enrollment", "33-hour non-response", "Non-compliance — financial disclosure"];

export default function NarrativeGenerator() {
  const [generating, setGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [includeQuotes, setIncludeQuotes] = useState(true);
  const [includeFactors, setIncludeFactors] = useState(true);
  const [selectedThemes, setSelectedThemes] = useState(new Set(["Scheduling violations", "Communication failures"]));
  const [selectedEvidence, setSelectedEvidence] = useState(new Set(EVIDENCE_OPTIONS.slice(0, 4)));
  const { toast } = useToast();

  function toggleTheme(t: string) {
    const next = new Set(selectedThemes);
    next.has(t) ? next.delete(t) : next.add(t);
    setSelectedThemes(next);
  }

  function toggleEvidence(e: string) {
    const next = new Set(selectedEvidence);
    next.has(e) ? next.delete(e) : next.add(e);
    setSelectedEvidence(next);
  }

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setShowOutput(true); }, 2200);
  }

  function handleCopy() {
    navigator.clipboard.writeText(mockNarrativeDraft).then(() => {
      toast({ title: "Narrative copied to clipboard" });
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Narrative Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate a structured case narrative from your evidence.</p>
      </motion.div>

      <DisclaimerBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium mb-2">Issue Themes</p>
            <div className="space-y-2">
              {ISSUE_THEMES.map((theme) => (
                <div key={theme} className="flex items-center gap-2">
                  <Checkbox
                    id={`theme-${theme}`}
                    checked={selectedThemes.has(theme)}
                    onCheckedChange={() => toggleTheme(theme)}
                    data-testid={`checkbox-theme-${theme.replace(/\s+/g, "-").toLowerCase()}`}
                  />
                  <Label htmlFor={`theme-${theme}`} className="text-sm font-normal cursor-pointer">{theme}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Children to Include</p>
            <div className="space-y-2">
              {mockFloridaCase.children.map((child) => (
                <div key={child.id} className="flex items-center gap-2">
                  <Checkbox id={`child-${child.id}`} defaultChecked data-testid={`checkbox-child-${child.id}`} />
                  <Label htmlFor={`child-${child.id}`} className="text-sm font-normal cursor-pointer">{child.name} (age {child.age})</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Date Range From</Label>
              <input type="date" defaultValue="2026-01-01" className="w-full h-9 rounded-md border border-input bg-card px-3 text-sm" data-testid="input-date-from" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Date Range To</Label>
              <input type="date" defaultValue="2026-05-22" className="w-full h-9 rounded-md border border-input bg-card px-3 text-sm" data-testid="input-date-to" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-normal">Include direct quotes</Label>
              <Switch checked={includeQuotes} onCheckedChange={setIncludeQuotes} data-testid="switch-include-quotes" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-normal">Include factor mapping</Label>
              <Switch checked={includeFactors} onCheckedChange={setIncludeFactors} data-testid="switch-include-factors" />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Supporting Evidence</p>
            <div className="space-y-2">
              {EVIDENCE_OPTIONS.map((ev) => (
                <div key={ev} className="flex items-center gap-2">
                  <Checkbox
                    id={`ev-${ev}`}
                    checked={selectedEvidence.has(ev)}
                    onCheckedChange={() => toggleEvidence(ev)}
                    data-testid={`checkbox-evidence-${ev.replace(/\s+/g, "-").toLowerCase()}`}
                  />
                  <Label htmlFor={`ev-${ev}`} className="text-sm font-normal cursor-pointer">{ev}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full h-11 gap-2" onClick={handleGenerate} disabled={generating} data-testid="button-generate-narrative">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {generating ? "Generating narrative..." : "Generate Narrative"}
          </Button>
        </div>

        {showOutput && (
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Draft Narrative</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>~{mockNarrativeDraft.split(" ").length} words</span>
                <div className="flex items-center gap-1.5">
                  <span>Edit mode</span>
                  <Switch checked={editMode} onCheckedChange={setEditMode} className="scale-75" data-testid="switch-edit-mode" />
                </div>
              </div>
            </div>

            <Card className="border-primary/20">
              <CardContent className="p-4">
                {editMode ? (
                  <textarea
                    className="w-full min-h-[400px] text-sm leading-relaxed bg-transparent border-none outline-none resize-y"
                    defaultValue={mockNarrativeDraft.trim()}
                    data-testid="textarea-narrative-edit"
                  />
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {mockNarrativeDraft.trim().split("\n\n").map((para, i) => (
                      <p key={i} className="text-sm leading-relaxed mb-4 last:mb-0">{para.replace(/\*\*/g, "")}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2 flex-wrap">
              <Button size="sm" className="gap-1.5" data-testid="button-save-draft">
                <Save className="h-3.5 w-3.5" />
                Save Draft
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCopy} data-testid="button-copy-narrative">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" data-testid="button-export-narrative">
                <Download className="h-3.5 w-3.5" />
                Export DOCX
              </Button>
            </div>

            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
              <CardContent className="p-3 flex items-start gap-2">
                <Edit className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Attorney review required.</span> This draft must be reviewed and approved by a licensed attorney before submission to any court.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
