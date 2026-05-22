import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "./SeverityBadge";
import { QuoteBlock } from "./QuoteBlock";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import type { Pattern } from "@/data/mockData";

const trendConfig = {
  increasing: { icon: TrendingUp, label: "Increasing", className: "text-red-600 dark:text-red-400" },
  stable:     { icon: Minus,       label: "Stable",     className: "text-amber-600 dark:text-amber-400" },
  decreasing: { icon: TrendingDown, label: "Decreasing", className: "text-emerald-600 dark:text-emerald-400" },
};

export function PatternCard({ pattern }: { pattern: Pattern }) {
  const [expanded, setExpanded] = useState(false);
  const trend = trendConfig[pattern.trend];
  const TrendIcon = trend.icon;

  return (
    <Card data-testid={`pattern-card-${pattern.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-sm">{pattern.label}</h3>
          <div className="flex items-center gap-2 shrink-0">
            <SeverityBadge score={pattern.severity} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{pattern.description}</p>

        {expanded && (
          <div className="space-y-3 mb-3">
            <QuoteBlock>{pattern.exampleQuote}</QuoteBlock>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pattern.confidence * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold">{Math.round(pattern.confidence * 100)}%</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Instances</span>
                <span className="font-semibold">{pattern.supportingCount} documented</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.className}`}>
            <TrendIcon className="h-3 w-3" />
            {trend.label}
            <span className="text-muted-foreground font-normal ml-1">· {pattern.supportingCount} entries</span>
          </div>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setExpanded(!expanded)} data-testid={`button-expand-pattern-${pattern.id}`}>
            {expanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
            {expanded ? "Less" : "Details"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
