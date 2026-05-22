import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Copy, Link2, Shield, Eye, Monitor, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const RECIPIENT_TYPES = [
  { id: "attorney", label: "Attorney", description: "Licensed counsel reviewing your case" },
  { id: "mediator", label: "Mediator", description: "Neutral third-party mediator" },
  { id: "consultant", label: "Consultant", description: "Expert witness or case consultant" },
  { id: "self", label: "Self Export", description: "Personal archive copy" },
];

const ACCESS_LOG = [
  { who: "Atty. Robert Garza", when: "May 22, 2026 at 2:14 PM", device: "Desktop — Chrome", action: "Viewed" },
  { who: "Atty. Robert Garza", when: "May 22, 2026 at 2:41 PM", device: "Desktop — Chrome", action: "Downloaded" },
  { who: "Link accessed", when: "May 21, 2026 at 9:07 AM", device: "Mobile — Safari", action: "Viewed" },
];

export default function SecureShare() {
  const [recipientType, setRecipientType] = useState("attorney");
  const [canView, setCanView] = useState(true);
  const [canComment, setCanComment] = useState(false);
  const [canDownload, setCanDownload] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [generated, setGenerated] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1500);
  }

  function copyLink() {
    navigator.clipboard.writeText("https://share.familycourtai.app/s/MvT-2026-08e7f2c9");
    toast({ title: "Link copied to clipboard" });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Secure Share</h1>
        <p className="text-sm text-muted-foreground mt-1">Share your court packet with controlled access.</p>
      </motion.div>

      <div>
        <p className="text-sm font-medium mb-3">Recipient Type</p>
        <div className="grid grid-cols-2 gap-2">
          {RECIPIENT_TYPES.map((rt) => (
            <button
              key={rt.id}
              className={`p-3 rounded-xl border text-left transition-all ${recipientType === rt.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"}`}
              onClick={() => setRecipientType(rt.id)}
              data-testid={`recipient-${rt.id}`}
            >
              <p className="font-medium text-sm">{rt.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{rt.description}</p>
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "View", description: "Recipient can view the document", value: canView, setter: setCanView, id: "view" },
            { label: "Comment", description: "Recipient can add comments", value: canComment, setter: setCanComment, id: "comment" },
            { label: "Download", description: "Recipient can download a copy", value: canDownload, setter: setCanDownload, id: "download" },
          ].map((perm) => (
            <div key={perm.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{perm.label}</p>
                <p className="text-xs text-muted-foreground">{perm.description}</p>
              </div>
              <Switch checked={perm.value} onCheckedChange={perm.setter} data-testid={`switch-${perm.id}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Link Expires</Label>
          <Input type="date" defaultValue="2026-08-14" className="h-9" data-testid="input-expiry-date" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Watermark</Label>
          <div className="flex items-center gap-2 h-9">
            <Switch checked={watermark} onCheckedChange={setWatermark} data-testid="switch-watermark" />
            <span className="text-sm text-muted-foreground">{watermark ? "Enabled on all pages" : "Disabled"}</span>
          </div>
        </div>
      </div>

      <Button
        className="w-full h-11 gap-2"
        onClick={handleGenerate}
        disabled={generating}
        data-testid="button-generate-link"
      >
        {generating ? "Generating..." : "Generate Secure Link"}
      </Button>

      {generated && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <p className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">Secure link generated</p>
              </div>
              <div className="flex gap-2">
                <Input
                  value="https://share.familycourtai.app/s/MvT-2026-08e7f2c9"
                  readOnly
                  className="text-xs font-mono h-9 bg-white dark:bg-emerald-900"
                  data-testid="input-share-link"
                />
                <Button size="sm" variant="outline" className="h-9 gap-1.5 shrink-0" onClick={copyLink} data-testid="button-copy-link">
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> View only</span>
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Watermarked</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Expires Aug 14</span>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              Access Log
            </h2>
            <div className="space-y-2">
              {ACCESS_LOG.map((entry, i) => (
                <Card key={i} data-testid={`access-log-${i}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{entry.who}</p>
                        <p className="text-xs text-muted-foreground">{entry.when} · {entry.device}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${entry.action === "Downloaded" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-primary/10 text-primary"}`}>
                        {entry.action}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
