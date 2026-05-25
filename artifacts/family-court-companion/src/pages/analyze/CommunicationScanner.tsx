import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { QuoteBlock } from "@/components/app/QuoteBlock";
import { UploadCard } from "@/components/app/UploadCard";
import { Lock, Zap, Search, History, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

const responseDelayTrend = [
  { month: "Nov", "Avg Delay (hrs)": 2.1, Ignored: 0 },
  { month: "Dec", "Avg Delay (hrs)": 3.4, Ignored: 1 },
  { month: "Jan", "Avg Delay (hrs)": 5.2, Ignored: 2 },
  { month: "Feb", "Avg Delay (hrs)": 7.8, Ignored: 2 },
  { month: "Mar", "Avg Delay (hrs)": 9.1, Ignored: 4 },
  { month: "Apr", "Avg Delay (hrs)": 11.2, Ignored: 3 },
  { month: "May", "Avg Delay (hrs)": 8.7, Ignored: 2 },
];

const SEARCH_CHIPS = ["abuse", "late", "money", "interference", "safety", "non-cooperation", "schedule", "threats"];

const DEMO_RESULTS = [
  { date: "2026-05-12", category: "Scheduling", quote: "I'll be there when I get there. Stop texting me.", relevance: "Late pickup — 2 hours with no notice" },
  { date: "2026-05-10", category: "Communication", quote: "You always ruin everything for them.", relevance: "Hostile language during financial discussion" },
  { date: "2026-04-02", category: "Non-Responsiveness", quote: "I was busy. She's fine. (sent 33 hours later)", relevance: "Failure to respond to medical emergency" },
  { date: "2026-04-27", category: "Co-Parenting", quote: "I already signed him up. You'll have to work around it.", relevance: "Unilateral enrollment — conflicts with parenting time" },
];

const PREVIOUS_SCANS = [
  { id: "s1", date: "May 10, 2026", summary: "46 messages · 8 evidence entries found", preview: "Text thread — David Thompson" },
  { id: "s2", date: "Apr 28, 2026", summary: "132 messages · 14 evidence entries found", preview: "iMessage export Apr 1–28" },
];

export default function CommunicationScanner() {
  const [scanning, setScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [text, setText] = useState("");
  const [chips, setChips] = useState<Set<string>>(new Set());
  const [viewingScan, setViewingScan] = useState<string | null>(null);
  const { toast } = useToast();

  function toggleChip(c: string) {
    const next = new Set(chips);
    if (next.has(c)) next.delete(c); else next.add(c);
    setChips(next);
  }

  function handleScan() {
    setScanning(true);
    setTimeout(() => { setScanning(false); setShowResults(true); }, 2000);
  }

  function handleDemo() {
    setText(`[2026-05-12 17:02] David: I'll be there when I get there. Stop texting me.
[2026-05-12 17:45] Maria: Sofia is still waiting. Please respond.
[2026-05-10 21:47] David: You always ruin everything for them.
[2026-04-02 21:14] Maria: Sofia has a 103 fever. She needs to see the doctor tomorrow.
[2026-04-04 18:20] David: I was busy. She's fine.
[2026-04-27 09:30] David: I already signed him up. You'll have to work around it.`);
  }

  function handleSearchAll() {
    toast({ title: "Searching all saved scans...", description: "Found matches across 2 previous scans. Results shown below." });
    setShowResults(true);
  }

  function handleAutoScan() {
    toast({ title: "Auto-Scan requires Plus plan", description: "Upgrade to Plus to automatically scan all saved evidence for patterns." });
  }

  function handleViewScan(id: string) {
    setViewingScan(viewingScan === id ? null : id);
    setShowResults(true);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Comm Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Import text threads. AI finds every evidentiary message.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Label className="text-xs text-muted-foreground shrink-0">Your role</Label>
            <select className="flex-1 text-sm bg-transparent border-none outline-none" data-testid="select-role">
              <option>Petitioner</option>
              <option>Respondent</option>
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Privacy Guaranteed</span>
            </div>
            <p className="text-xs text-muted-foreground leading-tight">Encrypted, private, never shared</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm">Your Name</Label>
          <Input defaultValue="Maria Martinez" className="h-9 text-sm" data-testid="input-your-name" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Other Party's Name</Label>
          <Input defaultValue="David Thompson" className="h-9 text-sm" data-testid="input-other-name" />
        </div>
      </div>

      <Tabs defaultValue="paste">
        <TabsList className="w-full" data-testid="tabs-input-method">
          <TabsTrigger value="paste" className="flex-1">Paste Texts</TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">Upload File</TabsTrigger>
          <TabsTrigger value="screenshots" className="flex-1">Screenshots</TabsTrigger>
        </TabsList>
        <TabsContent value="paste" className="mt-3">
          <Textarea
            placeholder="Paste your message thread here..."
            className="min-h-[160px] font-mono text-xs"
            value={text}
            onChange={(e) => setText(e.target.value)}
            data-testid="textarea-messages"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{text.length.toLocaleString()} characters</span>
            <button className="text-primary hover:underline" onClick={handleDemo} data-testid="button-demo">Try with Demo Messages</button>
          </div>
        </TabsContent>
        <TabsContent value="upload" className="mt-3">
          <UploadCard accept=".pdf,.txt,.csv,.json,.doc,.docx" description="PDF, TXT, CSV, JSON, DOC, DOCX" />
        </TabsContent>
        <TabsContent value="screenshots" className="mt-3">
          <UploadCard accept=".jpg,.jpeg,.png,.webp" description="JPG, PNG, WebP screenshots" />
        </TabsContent>
      </Tabs>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Search for patterns</p>
        <div className="flex flex-wrap gap-2">
          {SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${chips.has(chip) ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"}`}
              onClick={() => toggleChip(chip)}
              data-testid={`chip-${chip}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button onClick={handleScan} disabled={scanning || !text.trim()} className="gap-1.5" data-testid="button-search-current">
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {scanning ? "Scanning..." : "Search Current Text"}
        </Button>
        <Button variant="outline" className="gap-1.5" onClick={handleSearchAll} data-testid="button-search-all">
          <History className="h-4 w-4" />
          Search All Scans
        </Button>
        <Button variant="outline" className="gap-1.5" onClick={handleAutoScan} data-testid="button-auto-scan">
          <Zap className="h-4 w-4" />
          Auto-Scan All
        </Button>
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Free scans used</span>
            <span className="text-xs text-muted-foreground">2 / 5</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "40%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Upgrade to Plus for unlimited scans</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          Previous Scans
        </h2>
        <div className="space-y-2">
          {PREVIOUS_SCANS.map((scan) => (
            <Card key={scan.id} className={`hover:border-primary/30 transition-colors cursor-pointer ${viewingScan === scan.id ? "border-primary/50 bg-primary/5" : ""}`} data-testid={`previous-scan-${scan.id}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{scan.preview}</p>
                    <p className="text-xs text-muted-foreground">{scan.date} · {scan.summary}</p>
                  </div>
                  <Button size="sm" variant={viewingScan === scan.id ? "default" : "ghost"} className="h-7 text-xs" onClick={() => handleViewScan(scan.id)}>
                    {viewingScan === scan.id ? "Hide" : "View"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showResults && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <DisclaimerBanner />
          <h2 className="text-sm font-semibold mb-3 mt-4">Found {DEMO_RESULTS.length} Evidentiary Messages</h2>
          <div className="space-y-3">
            {DEMO_RESULTS.map((r, i) => (
              <Card key={i} data-testid={`scan-result-${i}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{r.category}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <QuoteBlock>{r.quote}</QuoteBlock>
                  <p className="text-xs text-muted-foreground mt-1">{r.relevance}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Response Delay Trend */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Response Delay Trend</CardTitle>
            <p className="text-xs text-muted-foreground">Avg hours to respond + ignored requests · Nov 2025–May 2026</p>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={responseDelayTrend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                />
                <Bar yAxisId="left" dataKey="Ignored" fill="#dc2626" fillOpacity={0.75} radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="Avg Delay (hrs)" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3, fill: "#d97706", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
