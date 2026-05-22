import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { FileText, Download, Share2, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { mockFloridaCase, mockExhibits } from "@/data/mockData";

type PacketState = "editing" | "generating" | "complete" | "paywall";

const PACKET_SECTIONS = [
  { id: "cover", label: "Cover Page", description: "Case caption, parties, date, jurisdiction" },
  { id: "toc", label: "Table of Contents", description: "Indexed list of all exhibits" },
  ...mockExhibits.filter((e) => e.included).map((ex) => ({
    id: ex.id,
    label: `Exhibit ${ex.label} — ${ex.title}`,
    description: `${ex.sourceType} · ${new Date(ex.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }))
];

export default function CourtPacketPreview() {
  const [, setLocation] = useLocation();
  const [packetState, setPacketState] = useState<PacketState>("editing");
  const [activeSection, setActiveSection] = useState("cover");

  function handleGenerate() {
    setPacketState("generating");
    setTimeout(() => setPacketState("paywall"), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Court Packet</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate a formatted document ready for court filing.</p>
      </motion.div>

      {packetState === "complete" && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">Packet generated successfully</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">Martinez v. Thompson · 8 pages · {mockExhibits.filter((e) => e.included).length} exhibits</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Packet Cover Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Case Name</Label>
                <Input defaultValue="Maria Martinez v. David Thompson" className="h-8 text-sm" data-testid="input-case-name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Court</Label>
                <Input defaultValue="13th Judicial Circuit — Hillsborough County" className="h-8 text-sm" data-testid="input-court" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Date</Label>
                <Input type="date" defaultValue="2026-08-14" className="h-8 text-sm" data-testid="input-date" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Jurisdiction</Label>
                <Input defaultValue="Florida" className="h-8 text-sm" data-testid="input-jurisdiction" />
              </div>
            </CardContent>
          </Card>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Packet Contents</p>
            <div className="space-y-1.5">
              {PACKET_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  className={`w-full text-left p-2.5 rounded-lg border transition-colors ${activeSection === sec.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                  onClick={() => setActiveSection(sec.id)}
                  data-testid={`section-${sec.id}`}
                >
                  <p className="text-xs font-medium">{sec.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sec.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {packetState === "editing" && (
              <Button className="w-full h-11 gap-2" onClick={handleGenerate} data-testid="button-generate-pdf">
                <FileText className="h-4 w-4" />
                Generate PDF
              </Button>
            )}
            {packetState === "generating" && (
              <Button className="w-full h-11 gap-2" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating packet...
              </Button>
            )}
            {(packetState === "paywall" || packetState === "complete") && (
              <Button className="w-full h-11 gap-2" variant="outline" onClick={() => setLocation("/packet/share")} data-testid="button-share-securely">
                <Share2 className="h-4 w-4" />
                Share Securely
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <DisclaimerBanner />

          {packetState === "paywall" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-primary/30">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">PDF Export requires Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">Upgrade to Pro to generate and download formatted court packets as PDF.</p>
                  </div>
                  <div className="w-full space-y-2">
                    <Button className="w-full gap-2" onClick={() => setLocation("/settings/subscription")} data-testid="button-upgrade-pro">
                      Upgrade to Pro — $19.99/mo
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setPacketState("complete")} data-testid="button-demo-packet">
                      Preview Demo Packet
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Cancel anytime · 7-day free trial</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {(packetState === "editing" || packetState === "complete") && (
            <Card className="min-h-[500px]">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="text-sm text-muted-foreground">
                  {activeSection === "cover" ? "Cover Page Preview" : activeSection === "toc" ? "Table of Contents" : "Exhibit Preview"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {activeSection === "cover" && (
                  <div className="max-w-sm mx-auto text-center space-y-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">IN THE CIRCUIT COURT OF THE THIRTEENTH JUDICIAL CIRCUIT</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">IN AND FOR HILLSBOROUGH COUNTY, FLORIDA</p>
                    <div className="my-8 space-y-2">
                      <p className="text-sm">In re: The Matter of</p>
                      <p className="font-bold">MARIA MARTINEZ,</p>
                      <p className="text-sm text-muted-foreground">Petitioner,</p>
                      <p className="text-sm">vs.</p>
                      <p className="font-bold">DAVID THOMPSON,</p>
                      <p className="text-sm text-muted-foreground">Respondent.</p>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="font-semibold text-sm">PETITIONER'S EXHIBIT PACKET</p>
                      <p className="text-xs text-muted-foreground mt-1">Submitted in Support of Motion for Custody Determination</p>
                      <p className="text-xs text-muted-foreground mt-1">Hearing Date: August 14, 2026</p>
                    </div>
                  </div>
                )}
                {activeSection === "toc" && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold mb-4">TABLE OF CONTENTS</p>
                    {PACKET_SECTIONS.filter((s) => s.id !== "toc").map((sec, i) => (
                      <div key={sec.id} className="flex justify-between text-sm border-b border-dashed border-border pb-1">
                        <span>{sec.label}</span>
                        <span className="text-muted-foreground">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
                {!["cover", "toc"].includes(activeSection) && (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mb-3 text-muted-foreground/50" />
                    <p className="text-sm font-medium">Exhibit preview</p>
                    <p className="text-xs mt-1">Full content visible in exported PDF</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
