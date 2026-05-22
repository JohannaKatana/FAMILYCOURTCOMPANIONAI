import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { motion } from "framer-motion";

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

export default function CaseDetails() {
  const [, setLocation] = useLocation();
  const [represented, setRepresented] = useState(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <div className="flex-1 max-w-lg mx-auto w-full p-6 flex flex-col">
        <OnboardingProgress step={3} total={5} />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold mb-2">Case Details</h1>
          <p className="text-muted-foreground text-sm mb-6">Basic information to set up your case workspace.</p>
        </motion.div>

        <div className="space-y-4 flex-1">
          <div className="space-y-1.5">
            <Label htmlFor="nickname">Case Nickname</Label>
            <Input id="nickname" placeholder="e.g. Smith v. Jones" defaultValue="Martinez v. Thompson" data-testid="input-case-nickname" />
            <p className="text-xs text-muted-foreground">Only you can see this name</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="county">County</Label>
            <Input id="county" placeholder="e.g. Hillsborough County" defaultValue="Hillsborough County" data-testid="input-county" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="court">Court Name <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input id="court" placeholder="e.g. 13th Judicial Circuit" defaultValue="13th Judicial Circuit" data-testid="input-court-name" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hearing">Hearing Date <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input id="hearing" type="date" defaultValue="2026-08-14" data-testid="input-hearing-date" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium text-sm">Represented by an attorney?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Helps tailor document templates</p>
            </div>
            <Switch
              checked={represented}
              onCheckedChange={setRepresented}
              data-testid="switch-represented"
            />
          </div>

          {represented && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
              <Label htmlFor="attorney">Attorney Name</Label>
              <Input id="attorney" placeholder="Attorney full name" data-testid="input-attorney-name" />
            </motion.div>
          )}
        </div>

        <div className="pt-4">
          <Button className="w-full h-11" onClick={() => setLocation("/onboarding/people")} data-testid="button-continue">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
