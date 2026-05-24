import { useCase } from "@/context/CaseContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Layers, Activity, CalendarDays, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { CaseReadinessMeter } from "@/components/app/CaseReadinessMeter";
import { mockEvidenceEntries } from "@/data/mockData";

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86400000));
}

export default function HomeDashboard() {
  const { activeCase } = useCase();

  if (!activeCase) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto mt-20">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Welcome to Family Court AI</h2>
        <p className="text-muted-foreground mb-8">Set up your case to start organizing evidence and preparing for court.</p>
        <Link href="/onboarding/state">
          <Button className="h-12 px-8">Setup Your Case</Button>
        </Link>
      </div>
    );
  }

  const days = daysUntil(activeCase.hearingDate);

  const stats = [
    { label: "Evidence", value: activeCase.evidenceStats.totalEntries, href: "/evidence/library" },
    { label: "Weak Factors", value: activeCase.evidenceStats.weakFactors, href: "/analyze/gaps" },
    { label: "Missing Factors", value: activeCase.evidenceStats.missingFactors, href: "/analyze/gaps" },
    { label: "Documents", value: activeCase.evidenceStats.documents, href: "/documents" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 scale-150 transform translate-x-1/4 -translate-y-1/4">
            <BriefcaseIcon className="w-64 h-64" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary-foreground/20 px-2 py-0.5 rounded text-xs font-semibold">{activeCase.state}</span>
                  <span className="bg-primary-foreground/20 px-2 py-0.5 rounded text-xs font-semibold">{activeCase.caseType}</span>
                </div>
                <h1 className="text-2xl font-bold">{activeCase.caseNickname}</h1>
                <p className="text-primary-foreground/80 mt-1">{activeCase.courtName}</p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-primary-foreground/80 mb-1">Next Hearing</p>
                <div className="text-xl font-medium flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  {new Date(activeCase.hearingDate).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{days}</div>
                <div className="text-sm text-primary-foreground/80">days away</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <Card className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <span className="text-2xl font-bold mb-1">{stat.value}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <CaseReadinessMeter entries={mockEvidenceEntries} />

      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex overflow-x-auto pb-4 gap-3 snap-x">
          <Link href="/evidence/upload">
            <Button variant="outline" className="flex-col h-auto py-4 px-6 min-w-[120px] gap-2 shrink-0 snap-start">
              <Plus className="w-6 h-6" />
              <span>Add Evidence</span>
            </Button>
          </Link>
          <Link href="/analyze/scanner">
            <Button variant="outline" className="flex-col h-auto py-4 px-6 min-w-[120px] gap-2 shrink-0 snap-start">
              <Search className="w-6 h-6" />
              <span>Scan Msgs</span>
            </Button>
          </Link>
          <Link href="/analyze/gaps">
            <Button variant="outline" className="flex-col h-auto py-4 px-6 min-w-[120px] gap-2 shrink-0 snap-start">
              <Activity className="w-6 h-6" />
              <span>Find Gaps</span>
            </Button>
          </Link>
          <Link href="/packet/binder">
            <Button variant="outline" className="flex-col h-auto py-4 px-6 min-w-[120px] gap-2 shrink-0 snap-start">
              <Layers className="w-6 h-6" />
              <span>Build Packet</span>
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Evidence</h2>
          <Link href="/evidence/library" className="text-sm text-primary font-medium hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          {activeCase.recentEvidence.map((entry) => (
            <Link key={entry.id} href="/evidence/library">
              <Card className="overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-secondary text-secondary-foreground rounded">{entry.category}</span>
                    <span className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{entry.summary}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}
