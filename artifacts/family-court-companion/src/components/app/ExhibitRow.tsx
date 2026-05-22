import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import type { ExhibitItem } from "@/data/mockData";

type Props = {
  exhibit: ExhibitItem;
  onRemove?: (id: string) => void;
  onToggle?: (id: string) => void;
};

export function ExhibitRow({ exhibit, onRemove, onToggle }: Props) {
  const strengthColor =
    exhibit.strengthScore >= 8 ? "bg-emerald-500" :
    exhibit.strengthScore >= 5 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${exhibit.included ? "bg-card border-border" : "bg-muted/30 border-border/50 opacity-60"}`} data-testid={`exhibit-row-${exhibit.id}`}>
      <input
        type="checkbox"
        checked={exhibit.included}
        onChange={() => onToggle?.(exhibit.id)}
        className="h-4 w-4 rounded border-input text-primary"
        data-testid={`checkbox-exhibit-${exhibit.id}`}
      />
      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
        {exhibit.label}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{exhibit.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{exhibit.sourceType}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{new Date(exhibit.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${strengthColor}`} style={{ width: `${exhibit.strengthScore * 10}%` }} />
        </div>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => onRemove?.(exhibit.id)} data-testid={`button-remove-exhibit-${exhibit.id}`}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
