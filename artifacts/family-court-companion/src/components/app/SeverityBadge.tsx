type Props = { score: number; label?: string };

export function SeverityBadge({ score, label }: Props) {
  const color =
    score >= 8 ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800" :
    score >= 6 ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" :
    score >= 4 ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800" :
                 "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}>
      {score}/10{label ? ` ${label}` : ""}
    </span>
  );
}
