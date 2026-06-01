import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { StatsCard } from "@/components/app/StatsCard";
import { UploadCard } from "@/components/app/UploadCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Download, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { mockFloridaCase } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const stats = mockFloridaCase.communicationStats;

const AFFIDAVIT_TEXT = `During the period of January 1, 2026 through May 22, 2026, analysis of 247 documented communications between the parties reveals the following pattern:

The Respondent's average response time to Petitioner's messages was 11.2 hours, with a median response time of 7.4 hours. In 47% of documented exchanges, the Respondent's response exceeded 24 hours.

The Respondent failed to respond to 12 documented requests within any time period, including at least one request relating to a medical emergency involving the minor child Sofia Martinez (high fever, April 2, 2026 — response delay: 33 hours).

The Respondent refused 8 proposed schedule trade requests without offering alternative accommodations.

The Respondent's communications contained language characterized as hostile or aggressive on 23 documented occasions.

The Petitioner's cooperation score, as measured by response compliance and scheduling flexibility, is 68 out of 100. The Respondent's cooperation score is 32 out of 100.

This summary was generated from communications uploaded to Family Court Companion AI and is provided for informational purposes only. This document should be reviewed and verified by a licensed attorney before being submitted in any legal proceeding.`;

export default function CommunicationStats() {
  const [generating, setGenerating] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [text, setText] = useState("");
  const { toast } = useToast();

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setShowResults(true); }, 2000);
  }

  function copyAffidavit() {
    navigator.clipboard.writeText(AFFIDAVIT_TEXT).then(() => {
      toast({ title: "Copied to clipboard" });
    });
  }

  const statItems = [
    { label: "Avg Response Delay", value: `${stats.avgResponseDelayHours}h`, subtext: "above 24h: 47% of exchanges", trend: "up" as const, trendLabel: "Worsening" },
    { label: "Median Response Delay", value: `${stats.medianResponseDelayHours}h`, subtext: "calculated across 247 messages" },
    { label: "Ignored Requests", value: stats.ignoredRequests, subtext: "no response at any time", highlight: true },
    { label: "Refused Schedule Trades", value: stats.refusedTrades, subtext: "no alternative offered", highlight: true },
    { label: "Schedule Change Attempts", value: stats.scheduleChangeAttempts, subtext: "by Respondent" },
    { label: "Hostile Language Count", value: stats.hostileLanguageCount, subtext: "flagged messages", trend: "up" as const, trendLabel: "Increasing" },
    { label: "Your Cooperation Score", value: "68/100", subtext: "Petitioner baseline", trend: "down" as const, trendLabel: "Stable" },
    { label: "Other Party Score", value: `${stats.cooperationScore}/100`, subtext: "Respondent baseline", highlight: true },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Communication Statistics</h1>
        <p className="text-sm text-muted-foreground mt-1">Response delay heuristics and affidavit-ready summaries.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm">Your Role</Label>
          <select className="w-full h-9 rounded-md border border-input bg-card px-3 text-sm" data-testid="select-role">
            <option>Petitioner</option>
            <option>Respondent</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Other Party's Name</Label>
          <Input defaultValue="David Thompson" className="h-9 text-sm" data-testid="input-other-name" />
        </div>
      </div>

      <Tabs defaultValue="paste">
        <TabsList className="w-full">
          <TabsTrigger value="paste" className="flex-1">Paste Text</TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">Upload File</TabsTrigger>
        </TabsList>
        <TabsContent value="paste" className="mt-3">
          <Textarea
            placeholder="Paste your complete message thread here..."
            className="min-h-[120px] font-mono text-xs"
            value={text}
            onChange={(e) => setText(e.target.value)}
            data-testid="textarea-messages"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{text.length.toLocaleString()} characters</span>
            <span>~{Math.round(text.length / 6)} words</span>
          </div>
        </TabsContent>
        <TabsContent value="upload" className="mt-3">
          <UploadCard accept=".pdf,.txt,.csv,.json,.doc,.docx" description="PDF, TXT, CSV, JSON, DOC, DOCX" />
        </TabsContent>
      </Tabs>

      <Button className="w-full h-11 gap-1.5" onClick={handleGenerate} disabled={generating} data-testid="button-generate-stats">
        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart2 className="h-4 w-4" />}
        {generating ? "Analyzing communications..." : "Generate Affidavit Statistics"}
      </Button>

      {showResults && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <DisclaimerBanner />

          <div>
            <h2 className="text-sm font-semibold mb-3">Communication Metrics</h2>
            <div className="grid grid-cols-2 gap-3">
              {statItems.map((s, i) => (
                <StatsCard key={i} {...s} />
              ))}
            </div>
          </div>

          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                Affidavit-Ready Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary mb-3">
                <pre className="text-xs text-foreground whitespace-pre-wrap leading-relaxed font-sans">{AFFIDAVIT_TEXT}</pre>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1.5" onClick={copyAffidavit} data-testid="button-copy-affidavit">
                  <Copy className="h-3.5 w-3.5" />
                  Copy Text
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" data-testid="button-export-affidavit">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
