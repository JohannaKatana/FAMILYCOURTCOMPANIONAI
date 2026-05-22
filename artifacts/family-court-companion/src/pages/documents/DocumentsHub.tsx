import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, BookOpen, User, Calendar, DollarSign, ArrowRight, Clock, Edit } from "lucide-react";
import { motion } from "framer-motion";

const DOC_TYPES = [
  { id: "narrative", icon: BookOpen, title: "Case Narrative Timeline", description: "Chronological summary of key events tied to custody factors.", href: "/documents/narrative" },
  { id: "motion", icon: Scale, title: "Motion Draft", description: "Formal request for court relief on a specific issue.", href: "/documents/motion" },
  { id: "brief", icon: FileText, title: "Brief Draft", description: "Legal argument document citing facts and applicable law.", href: "/documents/motion" },
  { id: "declaration", icon: User, title: "Declaration / Statement", description: "First-person sworn statement for submission to the court.", href: "/documents/motion" },
  { id: "parenting", icon: Calendar, title: "Parenting Plan Draft", description: "Proposed schedule and decision-making framework.", href: "/documents/motion" },
  { id: "financial", icon: DollarSign, title: "Financial Affidavit Draft", description: "Income, expenses, and asset disclosure template.", href: "/documents/motion" },
];

const RECENT_DRAFTS = [
  { id: "d1", type: "Case Narrative Timeline", date: "May 18, 2026", wordCount: "1,240 words", state: "draft" },
  { id: "d2", type: "Motion Draft — Late Pickup", date: "May 12, 2026", wordCount: "620 words", state: "complete" },
];

const FL_TEMPLATES = [
  "Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA) Affidavit",
  "Parenting Plan — Florida Family Law Form 12.995",
  "Financial Affidavit (Short Form) — Form 12.902(b)",
];

const CA_TEMPLATES = [
  "Declaration Under Uniform Child Custody Jurisdiction and Enforcement Act",
  "Parenting Plan — Local Rules Compliant",
  "Income and Expense Declaration — FL-150",
];

export default function DocumentsHub() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">Documents</h1>
        <p className="text-sm text-muted-foreground mt-1">Drafting center — all AI-generated drafts require attorney review before filing.</p>
      </motion.div>

      <div>
        <h2 className="text-sm font-semibold mb-3">Generate New Document</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DOC_TYPES.map((doc, i) => {
            const Icon = doc.icon;
            return (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={doc.href}>
                  <Card className="hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full" data-testid={`doc-type-${doc.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                      </div>
                      <h3 className="font-medium text-sm mt-3 mb-1">{doc.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{doc.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3">Recent Drafts</h2>
        <div className="space-y-2">
          {RECENT_DRAFTS.map((draft) => (
            <Card key={draft.id} className="hover:border-primary/30 transition-colors" data-testid={`draft-${draft.id}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{draft.type}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{draft.date}</span>
                    <span>·</span>
                    <span>{draft.wordCount}</span>
                    <span className={`px-1.5 py-0.5 rounded-full font-medium ${draft.state === "complete" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`}>
                      {draft.state === "complete" ? "Ready" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" data-testid={`button-edit-draft-${draft.id}`}>
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[{ state: "FL", label: "Florida", templates: FL_TEMPLATES }, { state: "CA", label: "California", templates: CA_TEMPLATES }].map((group) => (
          <Card key={group.state}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">{group.state}</span>
                {group.label} Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {group.templates.map((t, i) => (
                <button key={i} className="w-full text-left text-xs text-muted-foreground hover:text-foreground flex items-start gap-2 group transition-colors" data-testid={`template-${group.state.toLowerCase()}-${i}`}>
                  <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                  {t}
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
