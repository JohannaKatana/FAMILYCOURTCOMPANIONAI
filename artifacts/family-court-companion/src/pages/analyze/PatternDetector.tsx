import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { PatternCard } from "@/components/app/PatternCard";
import { UploadCard } from "@/components/app/UploadCard";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Zap, ScanLine } from "lucide-react";
import { motion } from "framer-motion";
import { mockPatterns } from "@/data/mockData";

export default function PatternDetector() {
  const [scanning, setScanning] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [text, setText] = useState("");

  function handleDetect() {
    setScanning(true);
    setTimeout(() => { setScanning(false); setShowResults(true); }, 2000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Pattern Detector</h1>
        <p className="text-sm text-muted-foreground mt-1">Identify high-conflict behavioral patterns in communications.</p>
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

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Upload communications</p>
        <Card className="bg-muted/20">
          <CardContent className="p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Accepted file types:</p>
            {["Screenshots of text messages (JPG, PNG)", "PDF exports from messaging apps", "CSV, TXT, JSON text exports", "DOC, DOCX documents"].map((t, i) => (
              <p key={i} className="flex items-center gap-1.5"><span className="text-primary">·</span>{t}</p>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="paste">
        <TabsList className="w-full">
          <TabsTrigger value="paste" className="flex-1">Paste Text</TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">Upload File</TabsTrigger>
        </TabsList>
        <TabsContent value="paste" className="mt-3">
          <Textarea
            placeholder="Paste your message thread here..."
            className="min-h-[140px] font-mono text-xs"
            value={text}
            onChange={(e) => setText(e.target.value)}
            data-testid="textarea-messages"
          />
        </TabsContent>
        <TabsContent value="upload" className="mt-3">
          <UploadCard accept=".pdf,.txt,.csv,.json,.jpg,.png,.doc,.docx" description="PDF, TXT, CSV, JSON, JPG, PNG, DOC, DOCX" />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button
          onClick={handleDetect}
          disabled={scanning}
          className="gap-1.5"
          data-testid="button-detect-patterns"
        >
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
          {scanning ? "Detecting..." : "Detect Patterns"}
        </Button>
        <Button variant="outline" className="gap-1.5" onClick={() => setText(`[2026-05-12 17:02] David: I'll be there when I get there. Stop texting me.\n[2026-05-10 21:47] David: You always ruin everything for them.\n[2026-04-02 21:14] Maria: Sofia has a 103 fever. Please respond.\n[2026-04-04 18:20] David: I was busy. She's fine.`)} data-testid="button-load-demo">
          Load Demo Messages
        </Button>
        <Button variant="outline" className="gap-1.5" data-testid="button-scan-all-saved">
          <Zap className="h-4 w-4" />
          Scan All Saved Evidence
        </Button>
      </div>

      {showResults && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <DisclaimerBanner />
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Detected Patterns ({mockPatterns.length})</h2>
            <span className="text-xs text-muted-foreground">Sorted by severity</span>
          </div>
          <div className="space-y-3">
            {[...mockPatterns].sort((a, b) => b.severity - a.severity).map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
