import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { motion } from "framer-motion";
import { BarChart2, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { mockEvidenceEntries, mockCustodyFactors } from "@/data/mockData";

// ─── Chart Data ─────────────────────────────────────────────────────────────

const monthlyActivity = [
  { month: "Nov", Entries: 2, Incidents: 1 },
  { month: "Dec", Entries: 3, Incidents: 2 },
  { month: "Jan", Entries: 5, Incidents: 3 },
  { month: "Feb", Entries: 6, Incidents: 4 },
  { month: "Mar", Entries: 10, Incidents: 7 },
  { month: "Apr", Entries: 9, Incidents: 6 },
  { month: "May", Entries: 7, Incidents: 5 },
];

const categoryByMonth = [
  { month: "Jan", Scheduling: 1, Communication: 1, "Co-Parenting": 1, Financial: 0, Safety: 0 },
  { month: "Feb", Scheduling: 1, Communication: 1, "Co-Parenting": 1, Financial: 1, Safety: 0 },
  { month: "Mar", Scheduling: 3, Communication: 1, "Co-Parenting": 2, Financial: 0, Safety: 1 },
  { month: "Apr", Scheduling: 1, Communication: 1, "Co-Parenting": 2, Financial: 1, Safety: 1 },
  { month: "May", Scheduling: 2, Communication: 2, "Co-Parenting": 1, Financial: 0, Safety: 0 },
];

const responseDelayTrend = [
  { month: "Nov", "Avg Delay (hrs)": 2.1, Ignored: 0 },
  { month: "Dec", "Avg Delay (hrs)": 3.4, Ignored: 1 },
  { month: "Jan", "Avg Delay (hrs)": 5.2, Ignored: 2 },
  { month: "Feb", "Avg Delay (hrs)": 7.8, Ignored: 2 },
  { month: "Mar", "Avg Delay (hrs)": 9.1, Ignored: 4 },
  { month: "Apr", "Avg Delay (hrs)": 11.2, Ignored: 3 },
  { month: "May", "Avg Delay (hrs)": 8.7, Ignored: 2 },
];

const sourceBreakdown = [
  { name: "Texts / Screenshots", value: 5 },
  { name: "Notes", value: 4 },
  { name: "Documents", value: 3 },
  { name: "School Records", value: 2 },
  { name: "Medical Records", value: 2 },
  { name: "Court Documents", value: 2 },
];

const patternFrequency = [
  { name: "Non-Responsiveness", count: 31, severity: 6 },
  { name: "Interference", count: 22, severity: 8 },
  { name: "Gaslighting", count: 14, severity: 7 },
  { name: "Unilateral Decisions", count: 11, severity: 7 },
  { name: "DARVO", count: 8, severity: 5 },
];

const parentingCompliance = [
  { month: "Jan", Completed: 7, Late: 1, Cancelled: 0 },
  { month: "Feb", Completed: 6, Late: 1, Cancelled: 1 },
  { month: "Mar", Completed: 5, Late: 2, Cancelled: 1 },
  { month: "Apr", Completed: 6, Late: 1, Cancelled: 1 },
  { month: "May", Completed: 5, Late: 2, Cancelled: 1 },
];

const topEvidence = [...mockEvidenceEntries]
  .sort((a, b) => b.strengthScore - a.strengthScore)
  .slice(0, 6)
  .map((e) => ({
    name: e.title.length > 30 ? e.title.slice(0, 30) + "…" : e.title,
    strength: e.strengthScore,
    confidence: Math.round(e.confidenceScore * 100),
  }));

const factorCoverage = [
  { category: "Parental Fitness", covered: 2, weak: 0, missing: 1 },
  { category: "Co-Parenting", covered: 1, weak: 2, missing: 0 },
  { category: "Stability", covered: 3, weak: 0, missing: 0 },
  { category: "Safety", covered: 1, weak: 0, missing: 1 },
  { category: "Legal / Orders", covered: 1, weak: 0, missing: 0 },
  { category: "Financial", covered: 0, weak: 1, missing: 0 },
  { category: "Education", covered: 1, weak: 0, missing: 0 },
  { category: "Relationships", covered: 1, weak: 1, missing: 1 },
];

// ─── Colors ──────────────────────────────────────────────────────────────────

const C = {
  teal: "#2d8a8a",
  tealMid: "#3da0a0",
  amber: "#d97706",
  violet: "#7c3aed",
  blue: "#2563eb",
  red: "#dc2626",
  emerald: "#059669",
  slate: "#64748b",
};

const SOURCE_COLORS = [C.teal, C.violet, C.blue, C.amber, C.red, C.slate];
const CAT_COLORS: Record<string, string> = {
  Scheduling: C.teal,
  Communication: C.amber,
  "Co-Parenting": C.violet,
  Financial: C.blue,
  Safety: C.red,
};

// ─── Custom Donut SVG ────────────────────────────────────────────────────────

function DonutChart({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 52, r = 32, cx = 80, cy = 72;
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(angle + sweep);
    const y2 = cy + R * Math.sin(angle + sweep);
    const xi1 = cx + r * Math.cos(angle);
    const yi1 = cy + r * Math.sin(angle);
    const xi2 = cx + r * Math.cos(angle + sweep);
    const yi2 = cy + r * Math.sin(angle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z`;
    angle += sweep;
    return { path, color: colors[i % colors.length], name: d.name, value: d.value };
  });
  return (
    <svg viewBox="0 0 160 144" className="w-full" style={{ maxHeight: 144 }}>
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity={0.9} />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#94a3b8">entries</text>
    </svg>
  );
}

// ─── Reusable Card ───────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children, className = "" }: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-2xl overflow-hidden shadow-sm ${className}`}
    >
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-2 pb-3">{children}</div>
    </motion.div>
  );
}

function KpiCard({ label, value, sub, trend, color = "text-foreground" }: {
  label: string; value: string | number; sub?: string; trend?: "up" | "down" | "flat"; color?: string;
}) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-red-500" : trend === "down" ? "text-emerald-500" : "text-muted-foreground";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 shadow-sm"
    >
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1.5">{label}</p>
      <div className="flex items-end gap-1.5 mb-1">
        <span className={`text-2xl font-bold tabular-nums leading-none ${color}`}>{value}</span>
        {trend && <Icon className={`h-3.5 w-3.5 mb-0.5 ${trendColor}`} />}
      </div>
      {sub && <p className="text-[11px] text-muted-foreground leading-snug">{sub}</p>}
    </motion.div>
  );
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-xl px-3 py-2 text-xs">
      {label && <p className="font-semibold text-foreground mb-1.5">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5 py-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CaseIntelligence() {
  const coveredCount = mockCustodyFactors.filter((f) => f.status === "covered").length;
  const weakCount = mockCustodyFactors.filter((f) => f.status === "weak").length;
  const missingCount = mockCustodyFactors.filter((f) => f.status === "missing").length;

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Case Intelligence
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Martinez v. Thompson · Florida · Jan–May 2026</p>
        </div>
        <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold border border-primary/20">
          Hearing in 82 days
        </span>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Evidence" value={mockEvidenceEntries.length} sub="Across 7 categories" trend="up" color="text-primary" />
        <KpiCard label="Weak Factors" value={weakCount} sub="Low confidence coverage" trend="up" color="text-amber-500" />
        <KpiCard label="Missing Factors" value={missingCount} sub="No evidence gathered" trend="flat" color="text-red-500" />
        <KpiCard label="Readiness Score" value="81/100" sub="Pin 1 more entry for Strong" trend="down" color="text-primary" />
      </div>

      {/* Main area chart + Source donut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ChartCard className="md:col-span-2" title="Case Activity Over Time" subtitle="Evidence entries and documented incidents by month">
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={monthlyActivity} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="Entries" stroke={C.teal} strokeWidth={2.5} fill={C.teal} fillOpacity={0.12} dot={false} activeDot={{ r: 4, fill: C.teal }} />
              <Area type="monotone" dataKey="Incidents" stroke={C.amber} strokeWidth={2} fill={C.amber} fillOpacity={0.08} dot={false} strokeDasharray="5 3" activeDot={{ r: 4, fill: C.amber }} />
              <Legend iconType="plainline" iconSize={16} wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Evidence Source Mix" subtitle="Corroboration diversity">
          <DonutChart data={sourceBreakdown} colors={SOURCE_COLORS} />
          <div className="px-2 mt-1 space-y-1.5">
            {sourceBreakdown.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                <span className="text-muted-foreground flex-1 truncate">{s.name}</span>
                <span className="font-bold tabular-nums text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Stacked bar + Response delay */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="Incidents by Category" subtitle="Monthly breakdown Jan–May 2026">
          <ResponsiveContainer width="100%" height={188}>
            <BarChart data={categoryByMonth} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="Scheduling" stackId="a" fill={C.teal} />
              <Bar dataKey="Communication" stackId="a" fill={C.amber} />
              <Bar dataKey="Co-Parenting" stackId="a" fill={C.violet} />
              <Bar dataKey="Financial" stackId="a" fill={C.blue} />
              <Bar dataKey="Safety" stackId="a" fill={C.red} radius={[3, 3, 0, 0]} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Response Delay Trend" subtitle="Avg hours to respond + ignored requests">
          <ResponsiveContainer width="100%" height={188}>
            <ComposedChart data={responseDelayTrend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar yAxisId="left" dataKey="Ignored" fill={C.red} fillOpacity={0.75} radius={[3, 3, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="Avg Delay (hrs)" stroke={C.amber} strokeWidth={2.5} dot={{ r: 3, fill: C.amber, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Pattern frequency + Factor coverage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="Behavioral Pattern Frequency" subtitle="Documented incidents per detected pattern">
          <div className="px-2 pb-1 space-y-3">
            {patternFrequency.map((p) => {
              const pct = (p.count / 31) * 100;
              const sev = p.severity >= 7 ? C.red : p.severity >= 5 ? C.amber : C.slate;
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-foreground font-medium truncate mr-2">{p.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground">sev {p.severity}/10</span>
                      <span className="text-xs font-bold tabular-nums" style={{ color: sev }}>{p.count} incidents</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: sev }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-2 pt-3 flex items-center gap-4 text-[10px] text-muted-foreground border-t border-border mt-2">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: C.red }} />High risk (7+)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: C.amber }} />Medium (5–6)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: C.slate }} />Lower (&lt;5)</span>
          </div>
        </ChartCard>

        <ChartCard title="Custody Factor Coverage" subtitle={`${coveredCount} covered · ${weakCount} weak · ${missingCount} missing`}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={factorCoverage} layout="vertical" margin={{ top: 2, right: 8, left: 4, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 4]} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={82} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="covered" name="Covered" stackId="a" fill={C.teal} />
              <Bar dataKey="weak" name="Weak" stackId="a" fill={C.amber} />
              <Bar dataKey="missing" name="Missing" stackId="a" fill={C.red} fillOpacity={0.7} radius={[0, 3, 3, 0]} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Parenting time compliance + Top evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="Parenting Time Compliance" subtitle="Ordered exchange outcomes Jan–May 2026">
          <ResponsiveContainer width="100%" height={178}>
            <BarChart data={parentingCompliance} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="Completed" fill={C.emerald} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Late" fill={C.amber} />
              <Bar dataKey="Cancelled" fill={C.red} fillOpacity={0.8} radius={[3, 3, 0, 0]} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Evidence by Strength" subtitle="Highest-scoring entries for packet curation">
          <div className="px-2 pb-1 space-y-2.5">
            {topEvidence.map((e, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-foreground truncate mr-2 flex-1">{e.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground">{e.confidence}% conf</span>
                    <span className="text-xs font-bold tabular-nums text-primary">{e.strength}/10</span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: C.teal }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(e.strength / 10) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Court packet readiness */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-primary/20 rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Court Packet Readiness
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Exhibit review before filing</p>
          </div>
          <span className="text-sm font-bold text-primary">84%</span>
        </div>

        <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-5">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "84%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Exhibits labeled", value: "6 / 6", ok: true },
            { label: "With witnesses", value: "4 / 6", ok: true },
            { label: "With dates", value: "6 / 6", ok: true },
            { label: "Needs corroboration", value: "2 entries", ok: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl p-3 border ${
                item.ok
                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800"
                  : "border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800"
              }`}
            >
              <p className={`text-sm font-bold leading-none mb-1 ${item.ok ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>{item.value}</p>
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
