import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FactorChip } from "@/components/app/FactorChip";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, ChevronDown, ChevronUp, Eye, BookOpen, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import { mockCustodyFactors } from "@/data/mockData";

const COLLECTION_PLAN = [
  "Letter from Sofia's pediatrician documenting asthma medication changes without notification",
  "School records showing attendance and parental participation history",
  "Statement from Ms. Karen Wells (teacher) regarding late pickup on May 12",
  "Financial records showing child support payment history",
  "Mental health professional statement (if applicable)",
  "Extended family contact records documenting children's relationships"
];

export default function GapDetector() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [planOpen, setPlanOpen] = useState(false);
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  const covered = mockCustodyFactors.filter((f) => f.status === "covered").length;
  const weak = mockCustodyFactors.filter((f) => f.status === "weak").length;
  const missing = mockCustodyFactors.filter((f) => f.status === "missing").length;
  const contradicted = mockCustodyFactors.filter((f) => f.status === "contradicted").length;

  const filtered = filterStatus === "all"
    ? mockCustodyFactors
    : mockCustodyFactors.filter((f) => f.status === filterStatus);

  const statusCounts = [
    { label: "Covered", value: covered, status: "covered", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Weak", value: weak, status: "weak", color: "text-amber-600 dark:text-amber-400" },
    { label: "Missing", value: missing, status: "missing", color: "text-red-600 dark:text-red-400" },
    { label: "Contradicted", value: contradicted, status: "contradicted", color: "text-orange-600 dark:text-orange-400" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Custody Factor Review</h1>
        <p className="text-sm text-muted-foreground mt-1">Scan evidence against Florida's legal factors for custody / parenting time</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-3">
        {statusCounts.map((sc) => (
          <button
            key={sc.status}
            className={`p-3 rounded-xl border text-center transition-all hover:border-primary/50 ${filterStatus === sc.status ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            onClick={() => setFilterStatus(filterStatus === sc.status ? "all" : sc.status)}
            data-testid={`filter-status-${sc.status}`}
          >
            <p className={`text-xl font-bold ${sc.color}`}>{sc.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sc.label}</p>
          </button>
        ))}
      </div>

      <DisclaimerBanner />

      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" className="gap-1.5" data-testid="button-refresh">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Analysis
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setFilterStatus("weak")} data-testid="button-view-weak">
          <Eye className="h-3.5 w-3.5" />
          View Weak Factors
        </Button>
        <Button size="sm" className="gap-1.5" onClick={() => setPlanOpen(!planOpen)} data-testid="button-collection-plan">
          <BookOpen className="h-3.5 w-3.5" />
          Generate Collection Plan
        </Button>
      </div>

      {planOpen && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Recommended Evidence to Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {COLLECTION_PLAN.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-2">
        {filtered.map((factor, i) => (
          <motion.div key={factor.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="overflow-hidden" data-testid={`factor-card-${factor.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-sm leading-snug">{factor.name}</h3>
                      <FactorChip status={factor.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{factor.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Evidence</span>
                        <span className="text-sm font-semibold">{factor.evidenceCount} {factor.evidenceCount === 1 ? "entry" : "entries"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Confidence</span>
                        <div className="flex items-center gap-2">
                          <Progress value={factor.confidence * 100} className="h-1.5 flex-1" />
                          <span className="text-xs font-semibold tabular-nums">{Math.round(factor.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    {expandedFactor === factor.id && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">What to collect</p>
                        <p>
                          {factor.status === "missing"
                            ? "No evidence found for this factor. Document any relevant incidents, obtain records from doctors, schools, or third parties, and gather any communications that address this topic."
                            : factor.status === "weak"
                            ? "Some evidence exists but it may not be sufficient. Strengthen this factor by gathering additional documentation, witness statements, or corroborating records."
                            : "This factor has adequate coverage. Continue documenting ongoing incidents to maintain strength."}
                        </p>
                      </motion.div>
                    )}

                    <div className="flex gap-2">
                      {factor.evidenceCount > 0 && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" data-testid={`button-view-evidence-${factor.id}`}>
                          <Eye className="h-3 w-3" />
                          View Evidence
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1"
                        onClick={() => setExpandedFactor(expandedFactor === factor.id ? null : factor.id)}
                        data-testid={`button-what-to-collect-${factor.id}`}
                      >
                        {expandedFactor === factor.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        What to Collect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
