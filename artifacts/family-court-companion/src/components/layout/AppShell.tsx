import { useLocation } from "wouter";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  // No shell for auth/onboarding routes
  if (
    location === "/" ||
    location.startsWith("/sign-") ||
    location.startsWith("/onboarding")
  ) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
        <BottomNav className="md:hidden fixed bottom-0 left-0 right-0 z-50" />
      </div>
    </div>
  );
}