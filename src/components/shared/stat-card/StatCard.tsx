import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  hint?: string;
  accent?: string;
  className?: string;
}

/** KPI tile used by the dashboard and the card/client summaries. */
export default function StatCard({ title, children, icon, hint, accent = "bg-accent text-accent-foreground", className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-4 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl text-lg", accent)}>{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
