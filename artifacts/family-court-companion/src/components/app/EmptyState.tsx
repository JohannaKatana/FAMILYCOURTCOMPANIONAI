import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Inbox, Search, FolderOpen } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  file: FileText,
  inbox: Inbox,
  search: Search,
  folder: FolderOpen,
};

type Props = {
  icon?: string | React.ElementType;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
};

export function EmptyState({ icon = "inbox", title, description, action }: Props) {
  const Icon = typeof icon === "string" ? (iconMap[icon] ?? Inbox) : icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" data-testid="empty-state">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">{description}</p>}
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button size="sm" data-testid="button-empty-state-action">{action.label}</Button>
          </Link>
        ) : (
          <Button size="sm" onClick={action.onClick} data-testid="button-empty-state-action">{action.label}</Button>
        )
      )}
    </div>
  );
}
