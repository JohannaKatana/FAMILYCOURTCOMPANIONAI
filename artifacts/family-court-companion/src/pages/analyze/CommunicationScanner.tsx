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
import { Lock, Zap, Search, History, Loader2, MessageSquareOff, Eye, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

// ── Mock analytics data (FL: Martinez v. Thompson, Jan–May 2026) ──────────────

const responseDelayTrend = [
  { month: "Jan", "Avg Delay (hrs)": 5.2, Ignored: 2 },
  { month: "Feb", "Avg Delay (hrs)": 7.8, Ignored: 2 },
  { month: "Mar", "Avg Delay (hrs)": 9.1, Ignored: 4 },
  { month: "Apr", "Avg Delay (hrs)": 11.2, Ignored: 3 },
  { month: "May", "Avg Delay (hrs)": 8.7, Ignored: 2 },
];

const responseRateData = [
  { type: "Substantive", Maria: 88, David: 21 },
  { type: "View-Only",   Maria: 0,  David: 53 },
  { type: "Ack-Only",    Maria: 4,  David: 8  },
  { type: "No Response", Maria: 8,  David: 18 },
];

const timelinessData = [
  { label: "< 24 hrs",  Maria: 82, David: 18 },
  { label: "24–48 hrs", Maria: 11, David: 31 },
  { label: "> 48 hrs",  Maria: 7,  David: 51 },
];

const categoryNonResponse = [
  { topic: "Schedule",   ignored: 28, viewedOnly: 24, substantive: 48 },
  { topic: "School",     ignored: 35, viewedOnly: 30, substantive: 35 },
  { topic: "Medical",    ignored: 15, viewedOnly: 60, substantive: 25 },
  { topic: "Visitation", ignored: 42, viewedOnly: 22, substantive: 36 },
  { topic: "Financial",  ignored: 30, viewedOnly: 20, substantive: 50 },
  { topic: "Welfare",    ignored: 55, viewedOnly: 30, substantive: 15 },
  { topic: "Holidays",   ignored: 38, viewedOnly: 28, substantive: 34 },
];

const SEARCH_CHIPS = [
  "schedule", "school", "medical", "visitation", "welfare",
  "financial", "safety", "interference", "threats", "non-cooperation",
];

const DEMO_RESULTS = [
  { date: "2026-05-12", category: "Scheduling", quote: "I'll be there when I get there. Stop texting me.", relevance: "Late pickup — 2 hrs no notice. Response delay: 4.5 hrs." },
  { date: "2026-05-10", category: "Communication", quote: "You always ruin everything for them.", relevance: "Hostile language during financial discussion. No substantive reply." },
  { date: "2026-04-02", category: "Non-Responsiveness", quote: "I was busy. She's fine. (sent 33 hours later)", relevance: "Failure to respond to medical emergency within 24 hrs." },
  { date: "2026-04-27", category: "Co-Parenting", quote: "I already signed him up. You'll have to work around it.", relevance: "Unilateral enrollment — no prior notice, viewed message 6 hrs earlier." },
];

const PREVIOUS_SCANS = [
  { id: "s1", date: "May 10, 2026", summary: "46 messages · 8 evidence entries found", preview: "Text thread — David Thompson" },
  { id: "s2", date: "Apr 28, 2026", summary: "132 messages · 14 evidence entries found", preview: "iMessage export Apr 1–28" },
];

const C = { blue: "#2563eb", sky: "#0ea5e9", amber: "#d97706", red: "#dc2626", slate: "#94a3b8", emerald: "#059669", violet: "#7c3aed" };

const tooltipStyle = {
  contentStyle: { fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" },
  labelStyle: { fontWeight: 600, marginBottom: 4 },
};

// ── Component ─────────────────────────────────────────────────────────────────

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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Comm Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Import message threads — AI finds evidentiary messages and response pattern data.</p>
      </motion.div>

      {/* Role + privacy */}
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

      {/* Names */}
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

      {/* Input method tabs */}
      <Tabs defaultValue="paste">
        <TabsList className="w-full" data-testid="tabs-input-method">
          <TabsTrigger value="paste" className="flex-1">Paste Texts</TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">Upload File</TabsTrigger>
          <TabsTrigger value="screenshots" className="flex-1">Screenshots</TabsTrigger>
        </TabsList>
        <TabsContent value="paste" className="mt-3">
          <Textarea
            placeholder="Paste your message thread here... Format: [date time] Name: message"
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
          <UploadCard accept=".pdf,.txt,.csv,.json,.doc,.docx" description="PDF, TXT, CSV, JSON — supports TalkingParents, OurFamilyWizard, SMS exports" />
        </TabsContent>
        <TabsContent value="screenshots" className="mt-3">
          <UploadCard accept=".jpg,.jpeg,.png,.webp" description="JPG, PNG, WebP screenshots" />
        </TabsContent>
      </Tabs>

      {/* Pattern chips */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Filter by topic / pattern</p>
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

      {/* Scan buttons */}
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

      {/* Usage meter */}
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

      {/* Previous scans */}
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

      {/* Scan results */}
      {showResults && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <DisclaimerBanner />

          {/* Post-scan KPI summary */}
          <div>
            <h2 className="text-sm font-semibold mb-3">Scan Summary — 178 messages analyzed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: MessageSquareOff, label: "David's Response Rate", value: "21%", sub: "of Maria's messages", color: "text-red-500" },
                { icon: Eye, label: "David's View-Only Rate", value: "53%", sub: "viewed, no reply", color: "text-amber-500" },
                { icon: Clock, label: "Avg Response Delay", value: "11.2 hrs", sub: "David to Maria", color: "text-orange-500" },
                { icon: AlertTriangle, label: "Ignored Requests", value: "12", sub: "no view, no reply", color: "text-red-600" },
              ].map(({ icon: Icon, label, value, sub, color }) => (
                <Card key={label}>
                  <CardContent className="p-3">
                    <Icon className={`h-4 w-4 mb-1 ${color}`} />
                    <p className="text-xs text-muted-foreground leading-tight">{label}</p>
                    <p className={`text-lg font-bold mt-0.5 ${color}`}>{value}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <h2 className="text-sm font-semibold">Found {DEMO_RESULTS.length} Evidentiary Messages</h2>
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

      {/* ── Response Pattern Analysis ─────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Response Pattern Analysis</h2>
          <p className="text-xs text-muted-foreground">Martinez v. Thompson · Jan–May 2026 · Demo data</p>
        </div>

        {/* Chart 1: Response type breakdown side-by-side */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Response Type Comparison</CardTitle>
            <p className="text-xs text-muted-foreground">How each party responds — substantive vs viewed-only vs ignored (%)</p>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={responseRateData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="type" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`]} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                <Bar dataKey="Maria" fill={C.blue} radius={[3, 3, 0, 0]} />
                <Bar dataKey="David" fill={C.red} fillOpacity={0.8} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Response timeliness */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Response Timeliness</CardTitle>
            <p className="text-xs text-muted-foreground">% of responses within 24 hrs, 24–48 hrs, and over 48 hrs</p>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={timelinessData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`]} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                <Bar dataKey="Maria" fill={C.blue} radius={[3, 3, 0, 0]} />
                <Bar dataKey="David" fill={C.amber} fillOpacity={0.85} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Non-response by topic (horizontal stacked) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Non-Response by Topic</CardTitle>
            <p className="text-xs text-muted-foreground">David's response outcome for each message category (% of Maria's messages in that topic)</p>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                layout="vertical"
                data={categoryNonResponse}
                margin={{ top: 4, right: 8, left: 50, bottom: 0 }}
                barSize={14}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                <YAxis type="category" dataKey="topic" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={58} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`]} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                <Bar dataKey="ignored" name="Ignored" stackId="a" fill={C.red} fillOpacity={0.8} />
                <Bar dataKey="viewedOnly" name="Viewed, No Reply" stackId="a" fill={C.amber} fillOpacity={0.8} />
                <Bar dataKey="substantive" name="Substantive Reply" stackId="a" fill={C.emerald} fillOpacity={0.8} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Response delay trend over time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Response Delay Trend</CardTitle>
            <p className="text-xs text-muted-foreground">Avg hours to respond (line) + completely ignored requests (bars) · Jan–May 2026</p>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={responseDelayTrend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar yAxisId="left" dataKey="Ignored" name="Ignored" fill={C.red} fillOpacity={0.75} radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="Avg Delay (hrs)" stroke={C.amber} strokeWidth={2.5} dot={{ r: 3, fill: C.amber, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
