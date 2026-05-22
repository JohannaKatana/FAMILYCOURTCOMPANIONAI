import { Link, useLocation } from "wouter";
import { Home, FileText, Activity, FileStack, Briefcase, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Evidence", href: "/evidence", icon: FileText },
  { name: "Analyze", href: "/analyze/scanner", icon: Activity },
  { name: "Docs", href: "/documents", icon: FileStack },
  { name: "Packet", href: "/packet/binder", icon: Briefcase },
];

export function BottomNav({ className }: { className?: string }) {
  const [location] = useLocation();

  return (
    <div className={`bg-card border-t border-border flex items-center justify-around h-16 px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-none ${className}`}>
      {mainNavItems.map((item) => {
        const isActive = location.startsWith(item.href);
        return (
          <Link key={item.name} href={item.href}>
            <div className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </div>
          </Link>
        );
      })}
      
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex flex-col items-center justify-center w-14 h-full gap-1 text-muted-foreground hover:text-foreground cursor-pointer">
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </div>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[50vh] rounded-t-xl">
          <div className="py-4 grid grid-cols-2 gap-4">
            <Link href="/settings/case"><Button variant="outline" className="w-full justify-start">Case Settings</Button></Link>
            <Link href="/settings/people"><Button variant="outline" className="w-full justify-start">People</Button></Link>
            <Link href="/settings/subscription"><Button variant="outline" className="w-full justify-start">Subscription</Button></Link>
            <Link href="/settings/help"><Button variant="outline" className="w-full justify-start">Help</Button></Link>
            <Link href="/"><Button variant="destructive" className="w-full justify-start">Sign Out</Button></Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}