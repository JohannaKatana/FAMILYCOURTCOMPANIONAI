import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Home, FileText, Activity, FileStack, Briefcase,
  Moon, Sun, Settings, LogOut, ChevronDown, ChevronRight,
  Search, BarChart2, GitBranch, ScanLine, Scale,
  BookOpen, FileEdit, Layers, Share2, Eye, Sparkles
} from "lucide-react";
import { useTheme } from "next-themes";

type NavChild = { name: string; href: string; icon: React.ElementType };
type NavItem = { name: string; href: string; icon: React.ElementType; children?: NavChild[] };

const navItems: NavItem[] = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Evidence", href: "/evidence", icon: FileText, children: [
    { name: "Evidence Hub", href: "/evidence", icon: FileText },
    { name: "Add Evidence", href: "/evidence/upload", icon: FileEdit },
    { name: "Library", href: "/evidence/library", icon: Layers },
  ]},
  { name: "Analyze", href: "/analyze/intelligence", icon: Activity, children: [
    { name: "Case Intelligence", href: "/analyze/intelligence", icon: Sparkles },
    { name: "Comm Analysis", href: "/analyze/scanner", icon: Search },
    { name: "Custody Factor Review", href: "/analyze/gaps", icon: GitBranch },
    { name: "Hearing Prep", href: "/analyze/simulator", icon: Scale },
    { name: "Pattern Detector", href: "/analyze/patterns", icon: ScanLine },
    { name: "Comm Statistics", href: "/analyze/stats", icon: BarChart2 },
  ]},
  { name: "Documents", href: "/documents", icon: FileStack, children: [
    { name: "All Documents", href: "/documents", icon: FileStack },
    { name: "Narrative", href: "/documents/narrative", icon: BookOpen },
    { name: "Motion / Brief", href: "/documents/motion", icon: Scale },
  ]},
  { name: "Packet", href: "/packet/binder", icon: Briefcase, children: [
    { name: "Exhibit Binder", href: "/packet/binder", icon: Layers },
    { name: "Court Packet", href: "/packet/preview", icon: Eye },
    { name: "Secure Share", href: "/packet/share", icon: Share2 },
  ]},
];

export function Sidebar({ className }: { className?: string }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const open = new Set<string>();
    navItems.forEach((item) => {
      if (item.children && location.startsWith(item.href)) open.add(item.name);
    });
    return open;
  });

  function toggleExpand(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  return (
    <aside className={`w-56 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground ${className}`}>
      <div className="h-14 flex items-center px-5 border-b border-sidebar-border shrink-0">
        <span className="font-bold text-base text-sidebar-primary-foreground tracking-tight">CaseClear</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.children ? item.children.some((c) => location === c.href) : false);
            const isExpanded = expanded.has(item.name);
            const hasChildren = !!item.children;

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                    onClick={() => toggleExpand(item.name)}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-sm flex-1">{item.name}</span>
                    {isExpanded ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                  </button>
                ) : (
                  <Link href={item.href}>
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                  </Link>
                )}

                {hasChildren && isExpanded && (
                  <ul className="mt-0.5 ml-3 pl-3 border-l border-sidebar-border space-y-0.5">
                    {item.children!.map((child) => {
                      const childActive = location === child.href;
                      return (
                        <li key={child.href}>
                          <Link href={child.href}>
                            <div className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-sm ${childActive ? "text-sidebar-primary-foreground font-medium bg-sidebar-primary/80" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                              <child.icon className="h-3.5 w-3.5 shrink-0" />
                              {child.name}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-sidebar-border shrink-0">
        <div className="space-y-0.5">
          <Link href="/settings/case">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </div>
          </Link>
          <div
            className="flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
