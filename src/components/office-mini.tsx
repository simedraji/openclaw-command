import { Link } from "@tanstack/react-router";
import { Building2, ArrowRight } from "lucide-react";

export function OfficeMini() {
  return (
    <div className="mx-2 mb-3">
      <Link
        to="/office"
        className="group flex w-full items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2 text-[12px] hover:border-primary/40 hover:bg-primary/5"
      >
        <span className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          <span>Open Virtual Office</span>
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
