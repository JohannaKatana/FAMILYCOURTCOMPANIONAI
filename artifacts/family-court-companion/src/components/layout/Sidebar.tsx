import { Link, useLocation } from "wouter";
import { Home, FileText, Activity, FileStack, Briefcase, Menu, Moon, Sun, Settings, LogOut, Users, HelpCircle, CreditCard } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Evidence", href: "/evidence", icon: FileText },
  { name: "Analyze", href: "/analyze/scanner", icon: Activity },
  { name: "Documents", href: "/documents", icon: FileStack },
  { name: "Packet", href: "/packet/binder", icon: Briefcase },
];

export function Sidebar({ className }: { className?: string }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <aside className={`w-64 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground ${className}`}>
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <span className="font-bold text-lg text-sidebar-primary-foreground tracking-tight">Family Court AI</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-1">
          <Link href="/settings/case">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </div>
          </Link>
          <div 
            className="flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Theme
            </div>
          </div>
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 cursor-pointer">
              <LogOut className="h-4 w-4" />
              Sign Out
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}