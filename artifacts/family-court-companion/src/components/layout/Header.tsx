import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Bell, AlertCircle, CalendarDays, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCase } from "@/context/CaseContext";
import { Link } from "wouter";

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    icon: CalendarDays,
    color: "text-amber-500",
    title: "Hearing in 87 days",
    body: "August 14, 2026 — 13th Judicial Circuit",
    time: "Today",
    unread: true,
  },
  {
    id: "n2",
    icon: AlertCircle,
    color: "text-red-500",
    title: "3 missing evidence factors",
    body: "Child's preference, financial compliance, sibling relationship gaps detected.",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n3",
    icon: FileText,
    color: "text-primary",
    title: "Communication scan complete",
    body: "14 evidentiary messages found in Apr 1–28 thread.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n4",
    icon: AlertCircle,
    color: "text-amber-500",
    title: "Motion draft needs review",
    body: "\"Motion Draft — Late Pickup\" is in draft state. Attorney review recommended.",
    time: "2d ago",
    unread: false,
  },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const { activeCase } = useCase();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-8 shrink-0 relative z-40">
      <div className="flex items-center gap-2">
        <h1 className="font-semibold md:hidden">CaseClear</h1>
        {activeCase && (
          <Link href="/settings/case">
            <div className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <span className="text-sm font-medium">{activeCase.caseNickname}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{activeCase.state}</span>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-1" ref={panelRef}>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-card" />
            )}
          </Button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">All caught up!</p>
                )}
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className={`flex gap-3 px-4 py-3 ${n.unread ? "bg-primary/5" : ""}`}>
                      <div className="shrink-0 mt-0.5">
                        <Icon className={`h-4 w-4 ${n.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-xs font-medium leading-snug ${n.unread ? "" : "text-muted-foreground"}`}>{n.title}</p>
                          <button
                            className="text-muted-foreground hover:text-foreground shrink-0"
                            onClick={() => dismiss(n.id)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border px-4 py-2">
                <button className="text-xs text-primary hover:underline w-full text-center">View all activity</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
