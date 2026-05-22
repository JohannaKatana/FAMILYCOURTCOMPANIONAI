import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Scale, RefreshCw, Users, UserCheck, ShieldAlert, MapPin, FileQuestion } from "lucide-react";
import { motion } from "framer-motion";
import { CASE_TYPES } from "@/data/mockData";

function OnboardingProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors ${i < step ? "bg-primary" : "bg-muted"}`} />
      ))}
      <span className="text-xs text-muted-foreground ml-2 shrink-0">{step}/{total}</span>
    </div>
  );
}

const icons: Record<string, React.ElementType> = {
  custody: Users,
  modification: RefreshCw,
  divorce: Scale,
  paternity: UserCheck,
  protection: ShieldAlert,
  relocation: MapPin,
  other: FileQuestion,
};

export default function SelectCaseType() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState("");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <div className="flex-1 max-w-lg mx-auto w-full p-6 flex flex-col">
        <OnboardingProgress step={2} total={5} />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold mb-2">What type of case?</h1>
          <p className="text-muted-foreground text-sm mb-6">This helps us tailor the analysis tools to your specific situation.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {CASE_TYPES.map((ct, i) => {
            const Icon = icons[ct.id] ?? Scale;
            const isSelected = selected === ct.id;
            return (
              <motion.button
                key={ct.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-primary/5 ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card"}`}
                onClick={() => setSelected(ct.id)}
                data-testid={`option-case-type-${ct.id}`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className={`font-medium text-sm ${isSelected ? "text-primary" : ""}`}>{ct.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{ct.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="pt-4">
          <Button
            className="w-full h-11"
            disabled={!selected}
            onClick={() => setLocation("/onboarding/case-details")}
            data-testid="button-continue"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
