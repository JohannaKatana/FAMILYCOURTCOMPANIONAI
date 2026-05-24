import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { Loader2, Copy, Download, Edit, AlertTriangle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const FACTORS = [
  "Willingness to honor time-sharing", "Co-parenting communication",
  "Parental fitness and character", "Child preference",
  "Continuity of school/community", "Compliance with prior orders"
];

const EVIDENCE_OPTIONS = [
  "Late pickup — May 12", "Medical non-disclosure", "Hostile texts",
  "Unilateral enrollment", "33-hour non-response", "Financial non-compliance"
];

const MOCK_DRAFT = `IN THE CIRCUIT COURT OF THE THIRTEENTH JUDICIAL CIRCUIT
IN AND FOR HILLSBOROUGH COUNTY, FLORIDA
FAMILY LAW DIVISION

In re: The Matter of
MARIA MARTINEZ, Petitioner,
vs.
DAVID THOMPSON, Respondent.
Case No.: [PENDING]

PETITIONER'S MOTION TO ENFORCE PARENTING PLAN
AND FOR MODIFICATION OF TIME-SHARING

COMES NOW the Petitioner, MARIA MARTINEZ, by and through her own person, and respectfully moves this Court to enforce the existing Parenting Plan and grant modification of time-sharing, and in support thereof states as follows:

I. INTRODUCTION AND RELIEF REQUESTED

Petitioner seeks enforcement of the Temporary Order entered February 14, 2025, and requests modification of the current parenting plan based on a substantial change in circumstances, specifically the Respondent's documented pattern of non-compliance with scheduled parenting time, failure to communicate regarding the children's health and educational needs, and unilateral decision-making that has disrupted the children's stability.

II. STATEMENT OF FACTS

Since the entry of the Temporary Order, the Respondent has failed to comply with the agreed parenting schedule on multiple documented occasions. On May 12, 2026, the Respondent arrived two hours late for the scheduled pickup without advance notice and failed to respond to seven (7) text messages and two (2) phone calls during that period. [Exhibit A]

On April 2, 2026, the Petitioner notified the Respondent that the minor child Sofia had a fever of 103°F and required coordination for a physician appointment. The Respondent failed to respond for thirty-three (33) hours. [Exhibit B]

III. APPLICABLE LAW

Under § 61.13, Florida Statutes, the court shall determine all matters relating to parenting and time-sharing of each minor child based on the best interests of the child. Among the factors the court shall consider is each parent's demonstrated capacity and disposition to comply with the time-sharing schedule. [citations omitted]

[Attorney Review Required — Complete draft not shown. This document was AI-generated and must be reviewed by a licensed attorney before filing.]`;

const SECTION_OUTLINE = [
  "Caption / Court Header",
  "I. Introduction and Relief Requested",
  "II. Statement of Facts",
  "III. Applicable Law",
  "IV. Argument",
  "V. Prayer for Relief",
  "Certificate of Service"
];

export default function MotionBriefGenerator() {
  const [generating, setGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [docType, setDocType] = useState("motion");
  const [formality, setFormality] = useState([70]);
  const [activeSection, setActiveSection] = useState(0);
  const { toast } = useToast();

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setShowOutput(true); }, 2400);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Motion / Brief Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">Draft a legal document based on your evidence and jurisdiction.</p>
      </motion.div>

      <DisclaimerBanner />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm">Document Type</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger data-testid="select-doc-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motion">Motion to Enforce</SelectItem>
                <SelectItem value="motion-modify">Motion to Modify</SelectItem>
                <SelectItem value="brief">Legal Brief</SelectItem>
                <SelectItem value="declaration">Declaration / Affidavit</SelectItem>
                <SelectItem value="parenting">Parenting Plan Proposal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">Requested Relief</Label>
            <Textarea
              placeholder="Describe what you are asking the court to do..."
              defaultValue="Enforce the parenting schedule and grant modification to reduce Respondent's parenting time until compliance is demonstrated."
              className="min-h-[90px] text-sm"
              data-testid="textarea-requested-relief"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Relevant Factors</p>
            <div className="space-y-2">
              {FACTORS.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Checkbox id={`factor-${f}`} defaultChecked={f.includes("time-sharing") || f.includes("communication")} data-testid={`checkbox-factor-${f.replace(/\s+/g, "-").toLowerCase()}`} />
                  <Label htmlFor={`factor-${f}`} className="text-sm font-normal cursor-pointer">{f}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Supporting Evidence</p>
            <div className="space-y-2">
              {EVIDENCE_OPTIONS.map((ev) => (
                <div key={ev} className="flex items-center gap-2">
                  <Checkbox id={`ev-${ev}`} defaultChecked data-testid={`checkbox-ev-${ev.replace(/\s+/g, "-").toLowerCase()}`} />
                  <Label htmlFor={`ev-${ev}`} className="text-sm font-normal cursor-pointer text-xs">{ev}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Formality Level</Label>
              <span className="text-xs text-muted-foreground">{formality[0] < 40 ? "Informal" : formality[0] < 70 ? "Moderate" : "Formal"}</span>
            </div>
            <Slider value={formality} onValueChange={setFormality} min={10} max={100} step={10} data-testid="slider-formality" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Informal</span>
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">FL</span>
              <span>Formal</span>
            </div>
          </div>

          <Button className="w-full h-11 gap-2" onClick={handleGenerate} disabled={generating} data-testid="button-generate-document">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {generating ? "Generating document..." : "Generate Document"}
          </Button>
        </div>

        {showOutput && (
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Document Draft</h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(MOCK_DRAFT).then(() =>
                      toast({ title: "Copied to clipboard", description: "Document draft copied. Paste into a word processor for editing." })
                    );
                  }}
                  data-testid="button-copy-doc"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 text-xs"
                  onClick={() => toast({ title: "DOCX export requires Pro plan", description: "Upgrade to Pro to download editable Word documents." })}
                  data-testid="button-download-docx"
                >
                  <Download className="h-3 w-3" />
                  DOCX
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-32 shrink-0 space-y-1">
                {SECTION_OUTLINE.map((sec, i) => (
                  <button
                    key={i}
                    className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${activeSection === i ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    onClick={() => setActiveSection(i)}
                    data-testid={`section-${i}`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
              <Card className="flex-1 border-primary/20 overflow-hidden">
                <CardContent className="p-4 max-h-[500px] overflow-y-auto">
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans">{MOCK_DRAFT}</pre>
                </CardContent>
              </Card>
            </div>

            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
              <CardContent className="p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Attorney Review Required.</span> This AI-generated draft is a starting point only. It must be reviewed, edited, and approved by a licensed attorney in your jurisdiction before filing with any court.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
