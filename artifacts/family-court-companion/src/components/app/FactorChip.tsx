type FactorStatus = "covered" | "weak" | "missing" | "contradicted";

const statusConfig: Record<FactorStatus, { label: string; className: string }> = {
  covered:      { label: "Covered",      className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
  weak:         { label: "Weak",         className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" },
  missing:      { label: "Missing",      className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
  contradicted: { label: "Contradicted", className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800" },
};

type Props = { status: FactorStatus; showDot?: boolean };

export function FactorChip({ status, showDot = true }: Props) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.className}`}>
      {showDot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {cfg.label}
    </span>
  );
}
