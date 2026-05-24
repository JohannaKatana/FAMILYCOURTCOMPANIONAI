import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { TrendingUp, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { EvidenceEntry } from "@/data/mockData";

const ALL_CATEGORIES = [
  "Scheduling",
  "Communication",
  "Co-Parenting",
  "Financial",
  "Medical / Safety",
  "Legal / Discovery",
  "Activities / Education",
  "Children's Preferences",
];

type Dimension = {
  label: string;
  score: number;
  max: number;
  description: string;
  tip?: string;
};

function calcScore(entries: EvidenceEntry[]) {
  const n = entries.length;
  const pinned = entries.filter((e) => e.pinned).length;
  const avgStrength = n > 0 ? entries.reduce((s, e) => s + e.strengthScore, 0) / n : 0;
  const avgConfidence = n > 0 ? entries.reduce((s, e) => s + e.confidenceScore, 0) / n : 0;
  const uniqueCats = new Set(entries.map((e) => e.category)).size;
  const coveredCats = ALL_CATEGORIES.filter((c) => entries.some((e) => e.category === c));

  const dims: Dimension[] = [
    {
      label: "Volume",
      score: Math.min(n / 12, 1) * 25,
      max: 25,
      description: `${n} entr${n === 1 ? "y" : "ies"}`,
      tip: n < 12 ? `Add ${12 - n} more entries to max out volume score` : undefined,
    },
    {
      label: "Strength",
      score: (avgStrength / 10) * 25,
      max: 25,
      description: `Avg ${avgStrength.toFixed(1)}/10`,
      tip: avgStrength < 7 ? "Focus on adding witnessed or documented incidents" : undefined,
    },
    {
      label: "Coverage",
      score: (uniqueCats / 8) * 25,
      max: 25,
      description: `${uniqueCats}/8 categories`,
      tip: uniqueCats < 8 ? `Missing: ${ALL_CATEGORIES.filter((c) => !coveredCats.includes(c)).slice(0, 2).join(", ")}` : undefined,
    },
    {
      label: "Confidence",
      score: avgConfidence * 15,
      max: 15,
      description: `${Math.round(avgConfidence * 100)}% avg`,
      tip: avgConfidence < 0.75 ? "Add direct quotes, witnesses, or documentation" : undefined,
    },
    {
      label: "Key Evidence",
      score: Math.min(pinned / 3, 1) * 10,
      max: 10,
      description: `${pinned} pinned`,
      tip: pinned < 3 ? `Pin ${3 - pinned} more strongest entries` : undefined,
    },
  ];

  const total = Math.round(dims.reduce((s, d) => s + d.score, 0));
  const weakest = [...dims].sort((a, b) => a.score / a.max - b.score / b.max)[0];

  return { total, dims, weakest, coveredCats };
}

function grade(score: number): { label: string; color: string; ring: string; bg: string } {
  if (score >= 86) return { label: "Strong", color: "text-emerald-600 dark:text-emerald-400", ring: "stroke-emerald-500", bg: "bg-emerald-500" };
  if (score >= 71) return { label: "Adequate", color: "text-primary", ring: "stroke-primary", bg: "bg-primary" };
  if (score >= 51) return { label: "Building", color: "text-amber-600 dark:text-amber-400", ring: "stroke-amber-500", bg: "bg-amber-500" };
  if (score >= 31) return { label: "Developing", color: "text-orange-600 dark:text-orange-400", ring: "stroke-orange-500", bg: "bg-orange-500" };
  return { label: "Needs Work", color: "text-red-600 dark:text-red-400", ring: "stroke-red-500", bg: "bg-red-500" };
}

const RING_R = 36;
const RING_CIRC = 2 * Math.PI * RING_R;

export function CaseReadinessMeter({ entries }: { entries: EvidenceEntry[] }) {
  const { total, dims, weakest } = useMemo(() => calcScore(entries), [entries]);
  const { label, color, ring, bg } = grade(total);
  const dash = (total / 100) * RING_CIRC;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Case Readiness</span>
          <span className="ml-auto text-xs text-muted-foreground">updates live</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative shrink-0 w-20 h-20">
            <svg viewBox="0 0 88 88" className="w-20 h-20 -rotate-90">
              <circle cx="44" cy="44" r={RING_R} fill="none" strokeWidth="8" className="stroke-muted" />
              <motion.circle
                cx="44"
                cy="44"
                r={RING_R}
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={ring}
                strokeDasharray={RING_CIRC}
                animate={{ strokeDashoffset: RING_CIRC - dash }}
                initial={{ strokeDashoffset: RING_CIRC }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={`text-xl font-bold tabular-nums ${color}`}
                key={total}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {total}
              </motion.span>
              <span className="text-[10px] text-muted-foreground -mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-base font-semibold ${color}`}>{label}</span>
            </div>
            <div className="space-y-1.5">
              {dims.map((d) => {
                const pct = (d.score / d.max) * 100;
                return (
                  <div key={d.label} className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground w-16 shrink-0">{d.label}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${bg}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground w-12 text-right shrink-0">{d.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {weakest.tip && (
          <motion.div
            key={weakest.tip}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-start gap-2 bg-background/60 rounded-lg px-3 py-2 border border-border"
          >
            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground flex-1 leading-snug">
              <span className="font-medium text-foreground">{weakest.label}:</span> {weakest.tip}
            </p>
            {weakest.label === "Coverage" && (
              <Link href="/analyze/gaps">
                <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
              </Link>
            )}
            {weakest.label === "Volume" && (
              <Link href="/evidence/upload">
                <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
              </Link>
            )}
            {(weakest.label === "Key Evidence" || weakest.label === "Strength") && (
              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
