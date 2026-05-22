import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { CaseProvider } from "@/context/CaseContext";
import { AppShell } from "@/components/layout/AppShell";

import Welcome from "@/pages/Welcome";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import HomeDashboard from "@/pages/Home";
import NotFound from "@/pages/not-found";

import SelectState from "@/pages/onboarding/SelectState";
import SelectCaseType from "@/pages/onboarding/SelectCaseType";
import CaseDetails from "@/pages/onboarding/CaseDetails";
import PeopleAndChildren from "@/pages/onboarding/PeopleAndChildren";
import GuidedNextSteps from "@/pages/onboarding/GuidedNextSteps";

import EvidenceHub from "@/pages/evidence/EvidenceHub";
import EvidenceMaximizer from "@/pages/evidence/EvidenceMaximizer";
import AnalysisResults from "@/pages/evidence/AnalysisResults";
import EvidenceLibrary from "@/pages/evidence/EvidenceLibrary";

import CommunicationScanner from "@/pages/analyze/CommunicationScanner";
import GapDetector from "@/pages/analyze/GapDetector";
import CourtSimulator from "@/pages/analyze/CourtSimulator";
import PatternDetector from "@/pages/analyze/PatternDetector";
import CommunicationStats from "@/pages/analyze/CommunicationStats";

import DocumentsHub from "@/pages/documents/DocumentsHub";
import NarrativeGenerator from "@/pages/documents/NarrativeGenerator";
import MotionBriefGenerator from "@/pages/documents/MotionBriefGenerator";

import BinderBuilder from "@/pages/packet/BinderBuilder";
import CourtPacketPreview from "@/pages/packet/CourtPacketPreview";
import SecureShare from "@/pages/packet/SecureShare";

import CaseSettings from "@/pages/settings/CaseSettings";
import PeopleManager from "@/pages/settings/PeopleManager";
import Subscription from "@/pages/settings/Subscription";
import HelpAndDisclaimer from "@/pages/settings/HelpAndDisclaimer";

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Welcome} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/onboarding/state" component={SelectState} />
        <Route path="/onboarding/case-type" component={SelectCaseType} />
        <Route path="/onboarding/case-details" component={CaseDetails} />
        <Route path="/onboarding/people" component={PeopleAndChildren} />
        <Route path="/onboarding/guide" component={GuidedNextSteps} />

        <Route path="/home" component={HomeDashboard} />

        <Route path="/evidence" component={EvidenceHub} />
        <Route path="/evidence/upload" component={EvidenceMaximizer} />
        <Route path="/evidence/results" component={AnalysisResults} />
        <Route path="/evidence/library" component={EvidenceLibrary} />

        <Route path="/analyze/scanner" component={CommunicationScanner} />
        <Route path="/analyze/gaps" component={GapDetector} />
        <Route path="/analyze/simulator" component={CourtSimulator} />
        <Route path="/analyze/patterns" component={PatternDetector} />
        <Route path="/analyze/stats" component={CommunicationStats} />

        <Route path="/documents" component={DocumentsHub} />
        <Route path="/documents/narrative" component={NarrativeGenerator} />
        <Route path="/documents/motion" component={MotionBriefGenerator} />

        <Route path="/packet/binder" component={BinderBuilder} />
        <Route path="/packet/preview" component={CourtPacketPreview} />
        <Route path="/packet/share" component={SecureShare} />

        <Route path="/settings/case" component={CaseSettings} />
        <Route path="/settings/people" component={PeopleManager} />
        <Route path="/settings/subscription" component={Subscription} />
        <Route path="/settings/help" component={HelpAndDisclaimer} />

        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <CaseProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CaseProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
