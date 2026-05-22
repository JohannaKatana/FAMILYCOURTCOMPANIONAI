import { useTheme } from "next-themes";
import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCase } from "@/context/CaseContext";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { activeCase } = useCase();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="font-semibold md:hidden">Family Court AI</h1>
        {activeCase && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium">{activeCase.caseNickname}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{activeCase.state}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}