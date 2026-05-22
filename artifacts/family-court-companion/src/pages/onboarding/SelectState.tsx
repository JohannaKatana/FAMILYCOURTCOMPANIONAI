import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check } from "lucide-react";
import { motion } from "framer-motion";
import { US_STATES } from "@/data/mockData";

function OnboardingProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full flex-1 transition-colors ${i < step ? "bg-primary" : "bg-muted"}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-2 shrink-0">{step}/{total}</span>
    </div>
  );
}

export default function SelectState() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");

  const filtered = US_STATES.filter((s) => s.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <div className="flex-1 max-w-lg mx-auto w-full p-6 flex flex-col">
        <OnboardingProgress step={1} total={5} />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold mb-2">Select Your State</h1>
          <p className="text-muted-foreground text-sm mb-6">We tailor factor analysis and legal context to your jurisdiction.</p>
        </motion.div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search states..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="input-search-state"
          />
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-border divide-y divide-border">
          {filtered.map((state) => (
            <button
              key={state}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-muted transition-colors ${selected === state ? "bg-primary/5" : ""}`}
              onClick={() => setSelected(state)}
              data-testid={`option-state-${state.replace(/\s/g, "-").toLowerCase()}`}
            >
              <span className={selected === state ? "font-semibold text-primary" : ""}>{state}</span>
              {selected === state && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">No states match your search.</div>
          )}
        </div>

        <div className="pt-4">
          <Button
            className="w-full h-11"
            disabled={!selected}
            onClick={() => setLocation("/onboarding/case-type")}
            data-testid="button-continue"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
