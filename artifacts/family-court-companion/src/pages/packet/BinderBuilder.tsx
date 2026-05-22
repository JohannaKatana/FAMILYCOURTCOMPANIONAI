import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExhibitRow } from "@/components/app/ExhibitRow";
import { UploadCard } from "@/components/app/UploadCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Lightbulb, Wand2, Upload, FileText, Image, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { mockExhibits } from "@/data/mockData";
import type { ExhibitItem } from "@/data/mockData";

export default function BinderBuilder() {
  const [, setLocation] = useLocation();
  const [exhibits, setExhibits] = useState<ExhibitItem[]>(mockExhibits);

  function toggleExhibit(id: string) {
    setExhibits(exhibits.map((e) => e.id === id ? { ...e, included: !e.included } : e));
  }

  function removeExhibit(id: string) {
    setExhibits(exhibits.filter((e) => e.id !== id));
  }

  function autoOrganize() {
    const sorted = [...exhibits].sort((a, b) => b.strengthScore - a.strengthScore);
    const relabeled = sorted.map((e, i) => ({
      ...e,
      label: String.fromCharCode(65 + i),
      included: i < 5
    }));
    setExhibits(relabeled);
  }

  const included = exhibits.filter((e) => e.included);
  const excluded = exhibits.filter((e) => !e.included);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Exhibit Binder</h1>
        <p className="text-sm text-muted-foreground mt-1">Curate and organize your court exhibits.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Exhibits ({included.length} selected)</h2>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={autoOrganize} data-testid="button-auto-organize">
              <Wand2 className="h-3.5 w-3.5" />
              Auto-Organize
            </Button>
          </div>

          <div className="space-y-2">
            {included.map((exhibit) => (
              <ExhibitRow
                key={exhibit.id}
                exhibit={exhibit}
                onToggle={toggleExhibit}
                onRemove={removeExhibit}
              />
            ))}
            {included.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl">
                No exhibits selected. Check items below to add them.
              </div>
            )}
          </div>

          {excluded.length > 0 && (
            <>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider pt-2">Not Included</h3>
              <div className="space-y-2">
                {excluded.map((exhibit) => (
                  <ExhibitRow
                    key={exhibit.id}
                    exhibit={exhibit}
                    onToggle={toggleExhibit}
                    onRemove={removeExhibit}
                  />
                ))}
              </div>
            </>
          )}

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Add Documents</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Upload PDF", icon: Upload },
                { label: "Photo Evidence", icon: Image },
                { label: "Court Decision", icon: Scale },
              ].map(({ label, icon: Icon }) => (
                <Button key={label} variant="outline" className="flex-col h-auto py-3 gap-1.5 text-xs" data-testid={`button-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Curate Your Strongest Evidence
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Courts respond best to focused, well-organized exhibit packets.</p>
              <ul className="space-y-1">
                {[
                  "Include 3–8 strong exhibits",
                  "Each exhibit should address a specific factor",
                  "Label exhibits A, B, C... consecutively",
                  "Exclude weak or duplicative entries",
                  "Keep total packet under 50 pages when possible"
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exhibits included</span>
                <span className="font-semibold">{included.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg. strength</span>
                <span className="font-semibold">{included.length > 0 ? (included.reduce((sum, e) => sum + e.strengthScore, 0) / included.length).toFixed(1) : "—"}/10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-semibold text-xs px-2 py-0.5 rounded-full ${included.length >= 3 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`}>
                  {included.length >= 3 ? "Ready to build" : "Add more exhibits"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full h-11 gap-2"
            disabled={included.length === 0}
            onClick={() => setLocation("/packet/preview")}
            data-testid="button-build-packet"
          >
            <FileText className="h-4 w-4" />
            Build Packet ({included.length} exhibits)
          </Button>
        </div>
      </div>
    </div>
  );
}
