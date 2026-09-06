import type { ReactNode } from "react";
import { LoaderCircle, Play } from "lucide-react";
import { useOpenClawTask } from "@/hooks/use-openclaw";
import { Btn } from "@/components/ui-kit";

type OpenClawTaskButtonProps = {
  message: string;
  label: string;
  agentId?: string;
  children?: ReactNode;
  variant?: "default" | "primary" | "danger" | "ghost";
  size?: "sm" | "md";
  className?: string;
  onQueued?: () => void;
};

export function OpenClawTaskButton({
  message,
  label,
  agentId = "main",
  children,
  variant = "primary",
  size = "md",
  className,
  onQueued,
}: OpenClawTaskButtonProps) {
  const task = useOpenClawTask();

  return (
    <Btn
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={task.isPending}
      title={task.error instanceof Error ? task.error.message : undefined}
      onClick={() => task.mutate({ message, label, agentId }, { onSuccess: onQueued })}
    >
      {task.isPending ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Play className="h-3.5 w-3.5" />
      )}
      {children ?? "Run with OpenClaw"}
    </Btn>
  );
}
