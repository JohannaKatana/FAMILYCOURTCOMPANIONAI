import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EvidenceCard } from "@/components/app/EvidenceCard";
import { EmptyState } from "@/components/app/EmptyState";
import { Search, X, Layers, Clock, Archive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockEvidenceEntries } from "@/data/mockData";
import type { EvidenceEntry } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["All", "Scheduling", "Communication", "Co-Parenting", "Financial", "Medical / Safety", "Legal / Discovery", "Activities / Education", "Children's Preferences"];

export default function EvidenceLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [entries, setEntries] = useState<EvidenceEntry[]>(mockEvidenceEntries);
  const { toast } = useToast();

  const filtered = entries
    .filter((e) => {
      const matchesQuery = !query || e.title.toLowerCase().includes(query.toLowerCase()) || e.summary.toLowerCase().includes(query.toLowerCase());
      const matchesCat = category === "All" || e.category === category;
      return matchesQuery && matchesCat;
    })
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sort === "strongest") return b.strengthScore - a.strengthScore;
      return b.confidenceScore - a.confidenceScore;
    });

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function selectAll() { setSelected(new Set(filtered.map((e) => e.id))); }
  function clearSelection() { setSelected(new Set()); }

  function handlePin(id: string) {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, pinned: !e.pinned } : e));
    const entry = entries.find((e) => e.id === id);
    toast({ title: entry?.pinned ? "Entry unpinned" : "Entry pinned" });
  }

  function handleDelete(id: string) {
    const entry = entries.find((e) => e.id === id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
    toast({ title: "Entry deleted", description: `"${entry?.title}" removed.` });
  }

  function handleBulkAddToPacket() {
    toast({ title: `${selected.size} entries added to packet`, description: "Go to Packet → Exhibit Binder to review." });
    clearSelection();
  }

  function handleBulkArchive() {
    setEntries((prev) => prev.filter((e) => !selected.has(e.id)));
    toast({ title: `${selected.size} entries archived` });
    clearSelection();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Evidence Library</h1>
          <p className="text-sm text-muted-foreground">{entries.length} total entries</p>
        </div>
      </motion.div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search evidence..." value={query} onChange={(e) => setQuery(e.target.value)} data-testid="input-search-evidence" />
          {query && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setQuery("")}>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-36" data-testid="select-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="strongest">Strongest first</SelectItem>
            <SelectItem value="confidence">Most confident</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${category === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"}`}
            onClick={() => setCategory(cat)}
            data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {selected.size > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-primary">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={handleBulkAddToPacket}>
              <Layers className="h-3.5 w-3.5" />
              Add to Packet
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={() => toast({ title: "Timeline view coming soon" })}>
              <Clock className="h-3.5 w-3.5" />
              Timeline
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={handleBulkArchive}>
              <Archive className="h-3.5 w-3.5" />
              Archive
            </Button>
            <Button size="sm" variant="ghost" className="h-8" onClick={clearSelection}>Clear</Button>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        {selected.size < filtered.length ? (
          <button className="text-primary hover:underline" onClick={selectAll}>Select all</button>
        ) : (
          <button className="text-primary hover:underline" onClick={clearSelection}>Deselect all</button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <EmptyState icon="search" title="No evidence found" description="Try adjusting your search or filter criteria." />
        ) : (
          <div className="space-y-3">
            {filtered.map((entry) => (
              <motion.div key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EvidenceCard
                  entry={entry}
                  selectable
                  selected={selected.has(entry.id)}
                  onSelect={toggleSelect}
                  onPin={handlePin}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
