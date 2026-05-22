import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, User } from "lucide-react";
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

type Child = { id: string; name: string; birthDate: string; school: string; notes: string };

export default function PeopleAndChildren() {
  const [, setLocation] = useLocation();
  const [children, setChildren] = useState<Child[]>([
    { id: "c1", name: "Sofia", birthDate: "2017-09-03", school: "Westchase Elementary", notes: "Has asthma" },
    { id: "c2", name: "Lucas", birthDate: "2020-04-11", school: "Westchase K-8", notes: "" },
  ]);

  function addChild() {
    setChildren([...children, { id: `c${Date.now()}`, name: "", birthDate: "", school: "", notes: "" }]);
  }

  function removeChild(id: string) {
    setChildren(children.filter((c) => c.id !== id));
  }

  function updateChild(id: string, field: keyof Child, value: string) {
    setChildren(children.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <div className="flex-1 max-w-lg mx-auto w-full p-6 flex flex-col">
        <OnboardingProgress step={4} total={5} />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold mb-2">People & Children</h1>
          <p className="text-muted-foreground text-sm mb-6">Help us understand the parties involved in your case.</p>
        </motion.div>

        <div className="space-y-5 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Your Name</Label>
              <Input defaultValue="Maria Martinez" data-testid="input-your-name" />
            </div>
            <div className="space-y-1.5">
              <Label>Other Party's Name</Label>
              <Input defaultValue="David Thompson" data-testid="input-other-party-name" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Other Relevant People <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input placeholder="e.g. Grandparent, guardian, attorney" data-testid="input-other-people" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">Children</h2>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={addChild} data-testid="button-add-child">
                <Plus className="h-3.5 w-3.5" />
                Add Child
              </Button>
            </div>
            <div className="space-y-3">
              {children.map((child) => (
                <Card key={child.id} data-testid={`child-card-${child.id}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{child.name || "New Child"}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => removeChild(child.id)} data-testid={`button-remove-child-${child.id}`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input value={child.name} onChange={(e) => updateChild(child.id, "name", e.target.value)} placeholder="First name" className="h-8 text-sm" data-testid={`input-child-name-${child.id}`} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Birth Date</Label>
                        <Input type="date" value={child.birthDate} onChange={(e) => updateChild(child.id, "birthDate", e.target.value)} className="h-8 text-sm" data-testid={`input-child-birthdate-${child.id}`} />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs">School</Label>
                        <Input value={child.school} onChange={(e) => updateChild(child.id, "school", e.target.value)} placeholder="School name" className="h-8 text-sm" data-testid={`input-child-school-${child.id}`} />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs">Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <Input value={child.notes} onChange={(e) => updateChild(child.id, "notes", e.target.value)} placeholder="e.g. medical needs, therapy" className="h-8 text-sm" data-testid={`input-child-notes-${child.id}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full h-11" onClick={() => setLocation("/onboarding/guide")} data-testid="button-finish-setup">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
