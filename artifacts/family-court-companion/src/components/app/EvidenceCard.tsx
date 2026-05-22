import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pin, Trash2, Clock, Edit, Plus, ChevronDown, ChevronUp } from "lucide-react";
import type { EvidenceEntry } from "@/data/mockData";

function StrengthBar({ score }: { score: number }) {
  const color = score >= 8 ? "bg-emerald-500" : score >= 5 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score * 10}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums">{score}/10</span>
    </div>
  );
}

type EvidenceCardProps = {
  entry: EvidenceEntry;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onPin?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
};

export function EvidenceCard({ entry, selectable, selected, onSelect, onPin, onDelete, compact }: EvidenceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card data-testid={`evidence-card-${entry.id}`} className={`overflow-hidden transition-all ${selected ? "ring-2 ring-primary" : ""} ${entry.pinned ? "border-primary/30" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {selectable && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect?.(entry.id)}
              className="mt-1 h-4 w-4 rounded border-input text-primary"
              data-testid={`checkbox-evidence-${entry.id}`}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap gap-1.5 items-center">
                <Badge variant="secondary" className="text-xs">{entry.category}</Badge>
                {entry.pinned && <Badge className="text-xs bg-primary/10 text-primary border-primary/20">Pinned</Badge>}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-1 leading-snug">{entry.title}</h3>
            {!compact && <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{entry.summary}</p>}

            {!compact && expanded && (
              <div className="space-y-3 mb-3">
                {entry.directQuote && (
                  <blockquote className="border-l-2 border-primary pl-3 italic text-sm text-muted-foreground">
                    "{entry.directQuote}"
                  </blockquote>
                )}
                {entry.witnesses.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Witnesses</span>
                    <div className="flex flex-wrap gap-1">
                      {entry.witnesses.map((w, i) => (
                        <span key={i} className="text-xs bg-secondary px-2 py-0.5 rounded-full">{w}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Factor Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {entry.factorTags.map((tag, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Strength</span>
                <StrengthBar score={entry.strengthScore} />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${entry.confidenceScore * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold tabular-nums">{Math.round(entry.confidenceScore * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              {!compact && (
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={() => setExpanded(!expanded)} data-testid={`button-expand-${entry.id}`}>
                  {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {expanded ? "Less" : "Details"}
                </Button>
              )}
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" data-testid={`button-edit-${entry.id}`}>
                <Edit className="h-3 w-3" />
                Edit
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={() => onPin?.(entry.id)} data-testid={`button-pin-${entry.id}`}>
                <Pin className="h-3 w-3" />
                Pin
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" data-testid={`button-add-timeline-${entry.id}`}>
                <Plus className="h-3 w-3" />
                Timeline
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => onDelete?.(entry.id)} data-testid={`button-delete-${entry.id}`}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
