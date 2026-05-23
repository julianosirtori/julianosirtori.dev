import {
  InfoCircledIcon,
  ExclamationTriangleIcon,
  LightningBoltIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import { ComponentType, ReactNode } from "react";

type Tone = "info" | "warn" | "tip" | "success";

interface CalloutProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}

const ICONS: Record<Tone, ComponentType<{ className?: string }>> = {
  info: InfoCircledIcon,
  warn: ExclamationTriangleIcon,
  tip: LightningBoltIcon,
  success: CheckCircledIcon,
};

const TONE_CLASSES: Record<Tone, string> = {
  info: "border-accent/40 bg-accent-muted/40 text-fg",
  warn: "border-warn/40 bg-warn/5 text-fg",
  tip: "border-accent/30 bg-accent-muted/30 text-fg",
  success: "border-success/40 bg-success/5 text-fg",
};

export function Callout({ tone = "info", title, children }: CalloutProps) {
  const Icon = ICONS[tone];
  return (
    <aside
      className={`my-6 flex gap-3 rounded-lg border p-4 ${TONE_CLASSES[tone]}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex flex-col gap-1">
        {title && <p className="text-fg text-sm font-medium">{title}</p>}
        <div className="text-fg-muted text-sm leading-relaxed [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </aside>
  );
}
