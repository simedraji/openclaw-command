import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          MerchIQ · Mission Control
        </div>
        <h1 className="mt-0.5 text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  right,
  children,
  className,
  dense,
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  dense?: boolean;
}) {
  return (
    <div className={cn("panel", className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {title}
          </div>
          {right}
        </div>
      )}
      <div className={cn(dense ? "p-0" : "p-4")}>{children}</div>
    </div>
  );
}

export function Btn({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "danger" | "ghost";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 border";
  const variants = {
    default: "border-border bg-secondary/60 text-foreground hover:bg-secondary",
    primary: "border-primary/40 bg-primary/15 text-primary hover:bg-primary/25",
    danger: "border-destructive/40 bg-destructive/15 text-destructive hover:bg-destructive/25",
    ghost:
      "border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50",
  };
  const sizes = { sm: "px-2 py-1 text-[11px]", md: "px-3 py-1.5 text-[12px]" };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {children}
      {hint && <div className="mt-1 text-[10px] text-muted-foreground">{hint}</div>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-md border border-border bg-input px-3 py-1.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40",
        props.className,
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-md border border-border bg-input px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-md border border-border bg-input px-3 py-1.5 text-[13px] text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40",
        props.className,
      )}
    />
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "ok" | "warn" | "danger";
}) {
  const toneCls = {
    default: "text-foreground",
    ok: "text-primary",
    warn: "text-warning",
    danger: "text-destructive",
  }[tone];
  return (
    <div className="panel p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-2xl font-semibold tracking-tight tabular-nums", toneCls)}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
