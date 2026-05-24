import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Trash2, Archive } from "lucide-react";
import { motion } from "framer-motion";
import { mockFloridaCase, US_STATES } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function CaseSettings() {
  const [represented, setRepresented] = useState(mockFloridaCase.isRepresented);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Case settings saved", description: "Your case information has been updated." });
    }, 600);
  }

  function handleArchive() {
    toast({ title: "Case archived", description: "Martinez v. Thompson has been archived. You can restore it from Settings." });
  }

  function handleDelete() {
    toast({
      title: "Confirmation required",
      description: "To permanently delete this case, please contact support. This action cannot be undone.",
      variant: "destructive",
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Case Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Martinez v. Thompson</p>
      </motion.div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Case Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Case Nickname</Label>
            <Input defaultValue={mockFloridaCase.caseNickname} data-testid="input-case-nickname" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>State</Label>
              <Select defaultValue={mockFloridaCase.state}>
                <SelectTrigger data-testid="select-state">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.slice(0, 10).map((s) => (
                    <SelectItem key={s} value={s.slice(0, 2).toUpperCase()}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>County</Label>
              <Input defaultValue={mockFloridaCase.county} data-testid="input-county" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Court Name</Label>
            <Input defaultValue={mockFloridaCase.courtName} data-testid="input-court-name" />
          </div>
          <div className="space-y-1.5">
            <Label>Hearing Date</Label>
            <Input type="date" defaultValue={mockFloridaCase.hearingDate} data-testid="input-hearing-date" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Represented by an attorney</p>
              <p className="text-xs text-muted-foreground mt-0.5">Adjusts document templates and guidance</p>
            </div>
            <Switch checked={represented} onCheckedChange={setRepresented} data-testid="switch-represented" />
          </div>
          {represented && (
            <div className="space-y-1.5">
              <Label>Attorney Name</Label>
              <Input placeholder="Attorney full name" data-testid="input-attorney-name" />
            </div>
          )}

          <Button className="w-full" onClick={handleSave} disabled={saving} data-testid="button-save-case">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-sm">Archive this case</p>
              <p className="text-xs text-muted-foreground mt-0.5">Hides from dashboard but preserves all data</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 border-destructive/30 text-destructive hover:text-destructive shrink-0" onClick={handleArchive} data-testid="button-archive-case">
              <Archive className="h-3.5 w-3.5" />
              Archive
            </Button>
          </div>
          <Separator />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-sm">Delete this case</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently removes all evidence, documents, and data. Cannot be undone.</p>
            </div>
            <Button variant="destructive" size="sm" className="gap-1.5 shrink-0" onClick={handleDelete} data-testid="button-delete-case">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
