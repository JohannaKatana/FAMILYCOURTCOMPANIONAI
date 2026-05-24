import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Upload, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { EvidenceCard } from "@/components/app/EvidenceCard";
import { EmptyState } from "@/components/app/EmptyState";
import { CaseReadinessMeter } from "@/components/app/CaseReadinessMeter";
import { mockEvidenceEntries } from "@/data/mockData";
import type { EvidenceEntry } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const tabs = ["All", "Text", "Email", "Note", "Photo", "Document", "Audio"];

const categoryMap: Record<string, string[]> = {
  Text: ["Communication"],
  Email: ["Communication", "Legal / Discovery"],
  Photo: ["Medical / Safety"],
  Document: ["Financial", "Legal / Discovery"],
  Note: ["Co-Parenting", "Scheduling"],
  Audio: [],
};

export default function EvidenceHub() {
  const [activeTab, setActiveTab] = useState("All");
  const [tipsOpen, setTipsOpen] = useState(false);
  const [entries, setEntries] = useState<EvidenceEntry[]>(mockEvidenceEntries);
  const { toast } = useToast();

  const filtered = activeTab === "All"
    ? entries
    : entries.filter((e) => {
        const cats = categoryMap[activeTab] ?? [];
        return cats.some((c) => e.category.toLowerCase().includes(c.toLowerCase()));
      });

  function handlePin(id: string) {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, pinned: !e.pinned } : e));
    const entry = entries.find((e) => e.id === id);
    toast({ title: entry?.pinned ? "Entry unpinned" : "Entry pinned", description: "Pinned entries appear at the top of your library." });
  }

  function handleDelete(id: string) {
    const entry = entries.find((e) => e.id === id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast({
      title: "Entry deleted",
      description: `"${entry?.title}" has been removed.`,
    });
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Evidence</h1>
          <p className="text-sm text-muted-foreground">{entries.length} entries · Martinez v. Thompson</p>
        </div>
        <Link href="/evidence/upload">
          <Button className="gap-1.5" data-testid="button-add-evidence">
            <Plus className="h-4 w-4" />
            Add Evidence
          </Button>
        </Link>
      </motion.div>

      <CaseReadinessMeter entries={entries} />

      <Link href="/evidence/upload">
        <Card className="border-dashed border-2 hover:border-primary/60 hover:bg-primary/5 transition-colors cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Upload className="h-8 w-8 text-primary" />
            <p className="font-medium text-sm">Upload or analyze evidence</p>
            <p className="text-xs text-muted-foreground">PDF, DOC, TXT, JPG, PNG — AI extracts what matters</p>
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardContent className="p-4">
          <button
            className="w-full flex items-center justify-between text-sm font-medium"
            onClick={() => setTipsOpen(!tipsOpen)}
            data-testid="button-toggle-tips"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              What makes strong evidence?
            </div>
            {tipsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {tipsOpen && (
            <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              {[
                "Direct quotes with specific dates and times",
                "Witnessed by a third party (teacher, doctor, family)",
                "Tied to a specific legal custody factor",
                "Part of a documented pattern (not a single incident)",
                "Supported by physical evidence or records",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">·</span>
                  {tip}
                </li>
              ))}
            </motion.ul>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex overflow-x-auto w-full justify-start gap-1 h-auto p-1 bg-muted rounded-lg">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t} className="shrink-0 text-xs" data-testid={`tab-${t.toLowerCase()}`}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon="file"
              title="No evidence in this category"
              description="Upload documents or paste text to analyze evidence in this category."
              action={{ label: "Upload Evidence", href: "/evidence/upload" }}
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((entry) => (
                <EvidenceCard
                  key={entry.id}
                  entry={entry}
                  onPin={handlePin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
