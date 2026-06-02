import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Shield, Lock, Server, EyeOff, Trash2, Download,
  CheckCircle2, AlertTriangle, Database, Globe, Key, RefreshCw
} from "lucide-react";
import { dataManagement } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";

const SECURITY_LAYERS = [
  {
    icon: Globe,
    title: "TLS 1.3 Encryption in Transit",
    detail: "All data between your browser and our servers is encrypted using TLS 1.3 — the same standard used by banks and government systems.",
    badge: "In Transit",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Database,
    title: "AES-256-GCM Encryption at Rest",
    detail: "Case data is encrypted with AES-256-GCM in the browser before being written to local storage. The encryption key lives only in your active session and is never stored on disk.",
    badge: "At Rest",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: Key,
    title: "User-Scoped Data Isolation",
    detail: "Every API request is validated against your authenticated session token. No one else — including our staff — can access your case data.",
    badge: "Access Control",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: EyeOff,
    title: "Never Used to Train AI",
    detail: "Your data is never shared with AI model providers for training. When AI features analyze your content, inputs are processed transiently and not retained by the model provider.",
    badge: "AI Privacy",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: Shield,
    title: "No Third-Party Data Sharing",
    detail: "We do not sell, license, or share your personal information or case data with any third parties — ever.",
    badge: "No Sharing",
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    icon: Server,
    title: "Rate Limiting & Request Security",
    detail: "All API endpoints are protected by rate limiting, HTTP security headers (via Helmet), and input validation (Zod schemas) to prevent abuse.",
    badge: "API Security",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-950/30",
  },
];

const DATA_TYPES = [
  { label: "Case details", where: "Encrypted localStorage (this device)", local: true },
  { label: "Evidence entries", where: "Encrypted localStorage (this device)", local: true },
  { label: "Communication scans", where: "Encrypted localStorage (this device)", local: true },
  { label: "Message thread text", where: "Processed transiently — not stored", local: false },
  { label: "Uploaded files / screenshots", where: "Secure object storage (AES-256)", local: true },
  { label: "App preferences", where: "Encrypted localStorage (this device)", local: true },
];

export default function DataPrivacy() {
  const [confirmClear, setConfirmClear] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  async function handleExport() {
    setExporting(true);
    try {
      const json = await dataManagement.exportAll();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fcc-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Export downloaded", description: "Your data has been saved as a JSON file." });
    } catch {
      toast({ title: "Export failed", description: "Unable to export data. Please try again.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }

  function handleClearData() {
    if (!confirmClear) { setConfirmClear(true); return; }
    dataManagement.clearAll();
    setConfirmClear(false);
    toast({ title: "Local data cleared", description: "All locally stored data has been removed from this device." });
  }

  const storedKb = Math.round(dataManagement.storageUsedBytes() / 1024);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Data & Privacy</h1>
        <p className="text-sm text-muted-foreground mt-1">How your case data is stored, protected, and controlled.</p>
      </motion.div>

      {/* Security commitment banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary mb-1">Family Court Companion AI Security Commitment</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All locally stored data is encrypted with AES-256-GCM in your browser before being written to disk. The encryption key lives only in your active session — closing the tab wipes the key. Data is also encrypted in transit (TLS 1.3). We never share your data with third parties or use it to train AI models.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security layers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Security Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SECURITY_LAYERS.map(({ icon: Icon, title, detail, badge, color, bg }) => (
            <div key={title} className={`rounded-lg p-3 ${bg}`}>
              <div className="flex items-start gap-3">
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-medium">{title}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium bg-background/60 ${color}`}>{badge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* What data is stored */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            What Data Is Stored and Where
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0 divide-y divide-border">
            {DATA_TYPES.map(({ label, where, local }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2">
                  {local
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    : <RefreshCw className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                  <span className="text-sm">{label}</span>
                </div>
                <span className="text-xs text-muted-foreground text-right max-w-[55%]">{where}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your rights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            Your Data Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            "Access your data at any time via export.",
            "Request permanent deletion of your account and all associated data.",
            "Receive a copy of your data in a portable format (JSON).",
            "Know exactly what data we hold and why.",
          ].map((right) => (
            <div key={right} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{right}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data management actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Manage Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Local storage used</span>
            <span className="font-medium">{storedKb} KB</span>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Download className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Export your data</p>
                <p className="text-xs text-muted-foreground">Download all your locally stored case data as a JSON file.</p>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs shrink-0" onClick={handleExport} disabled={exporting}>
                {exporting ? "Exporting…" : "Export"}
              </Button>
            </div>

            <div className="flex items-start gap-3">
              <Trash2 className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Clear local data</p>
                <p className="text-xs text-muted-foreground">Permanently remove all data stored on this device. This cannot be undone.</p>
              </div>
              <Button
                size="sm"
                variant={confirmClear ? "destructive" : "outline"}
                className="h-8 text-xs shrink-0"
                onClick={handleClearData}
              >
                {confirmClear ? (
                  <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Confirm</span>
                ) : "Clear"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-xs text-muted-foreground text-center">
        Family Court Companion AI · Version 1.0.0 · © 2026 · <a href="mailto:privacy@familycourtcompanion.ai" className="underline">privacy@familycourtcompanion.ai</a>
      </p>
    </div>
  );
}
