import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Trend = "up" | "down" | "neutral";

type Props = {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: Trend;
  trendLabel?: string;
  highlight?: boolean;
};

export function StatsCard({ label, value, subtext, trend, trendLabel, highlight }: Props) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-red-600 dark:text-red-400" : trend === "down" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground";

  return (
    <Card className={highlight ? "border-primary/30 bg-primary/5" : ""} data-testid="stats-card">
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>}
        {trend && trendLabel && (
          <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            <span className="text-xs font-medium">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
