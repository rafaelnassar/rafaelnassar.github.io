import { type ReactNode, useState, type SelectHTMLAttributes } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cardClassName } from "@/components/shared/cardStyles";
import { iconButtonClassName } from "@/components/shared/iconButtonStyles";
import { copyText } from "@/lib/clipboard";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

/** Ritmo interno dos painéis — alinhado ao gap-4 dos cards do portfolio. */
export const toolStackClassName = "space-y-4";

/** Inputs de linha única: h-10 + text-sm, texto centralizado verticalmente. */
export const fieldClassName = cn(
  "block h-10 w-full rounded-xl border border-input bg-background px-3 py-0 text-sm font-normal leading-10",
  "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  focusRing
);

/** Select nativo com chevron customizado — evita desalinhamento do indicador do browser. */
export const selectClassName = cn(
  fieldClassName,
  "appearance-none pr-10 cursor-pointer"
);

export const SelectInput = ({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select className={cn(selectClassName, className)} {...props}>
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden
    />
  </div>
);

export const textareaClassName = cn(
  "block w-full min-h-[5.5rem] rounded-xl border border-input bg-background px-3 py-2.5",
  "text-sm font-normal leading-relaxed resize-y font-mono",
  "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  focusRing
);

export const ToolPanel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cn(cardClassName(), className)}>{children}</div>;

export const ToolSplit = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("grid gap-4 md:grid-cols-2 md:items-start", className)}>
    {children}
  </div>
);

export const ToolActions = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>
);

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export const Field = ({ id, label, hint, error, children }: FieldProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium tracking-tight">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
        {error}
      </p>
    ) : hint ? (
      <p id={`${id}-hint`} className="text-xs text-muted-foreground leading-relaxed">
        {hint}
      </p>
    ) : null}
  </div>
);

interface CopyButtonProps {
  value: string;
  className?: string;
  size?: "icon" | "pill";
}

export const CopyButton = ({ value, className, size = "icon" }: CopyButtonProps) => {
  const { lang } = useLang();
  const tx = t(lang);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className={cn(
        "inline-flex items-center justify-center shrink-0 cursor-pointer",
        "disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200",
        size === "icon"
          ? cn(iconButtonClassName("ghost", "sm"), "rounded-lg")
          : cn(
              "gap-1.5 rounded-full px-3 h-9 text-xs font-medium",
              "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            ),
        focusRing,
        className
      )}
      aria-label={copied ? tx.labs.copied : tx.labs.copy}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      {size === "pill" ? (
        <span aria-hidden>{copied ? tx.labs.copied : tx.labs.copy}</span>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {copied ? tx.labs.copied : ""}
      </span>
    </button>
  );
};

interface ResultInlineProps {
  label?: string;
  value: string;
  mono?: boolean;
  footer?: ReactNode;
  className?: string;
}

export const ResultInline = ({
  label,
  value,
  mono = true,
  footer,
  className,
}: ResultInlineProps) => (
  <div className={cn("space-y-1.5", className)}>
    {label ? (
      <p className="text-sm font-medium tracking-tight">{label}</p>
    ) : null}
    <div className="relative flex min-h-10 items-center rounded-xl border border-input bg-background">
      <p
        className={cn(
          "flex-1 min-w-0 px-3 py-0 pr-10 text-sm break-all leading-normal",
          mono && "font-mono"
        )}
      >
        {value || "—"}
      </p>
      <CopyButton
        value={value}
        className="absolute right-1 top-1/2 -translate-y-1/2"
      />
    </div>
    {footer}
  </div>
);

interface ResultBoxProps {
  label: string;
  value: string;
  mono?: boolean;
}

export const ResultBox = ({ label, value, mono = true }: ResultBoxProps) => (
  <ResultInline label={label} value={value} mono={mono} />
);

interface ResultBlockProps {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
  wrap?: "all" | "words";
  tall?: boolean;
}

/** Bloco de resultado multilinha (JSON, logs, prosa) com scroll e cópia no cabeçalho. */
export const ResultBlock = ({
  label,
  value,
  mono = true,
  className,
  wrap = "all",
  tall = false,
}: ResultBlockProps) => (
  <div className={cn("space-y-1.5", className)}>
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm font-medium tracking-tight">{label}</p>
      <CopyButton value={value} />
    </div>
    <div className="rounded-xl border border-input bg-background overflow-hidden">
      <pre
        className={cn(
          "overflow-auto px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
          tall ? "min-h-48 max-h-[28rem]" : "max-h-72",
          wrap === "words" ? "break-words" : "break-all",
          mono ? "font-mono" : "font-sans"
        )}
      >
        {value || "—"}
      </pre>
    </div>
  </div>
);

interface CheckRowProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckRow = ({ id, label, checked, onChange }: CheckRowProps) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2.5 text-sm cursor-pointer min-h-10"
  >
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className={cn("size-4 rounded border-border accent-foreground cursor-pointer shrink-0", focusRing)}
    />
    <span className="leading-snug">{label}</span>
  </label>
);

interface CheckGridProps {
  legend?: string;
  children: ReactNode;
}

export const CheckGrid = ({ legend, children }: CheckGridProps) => (
  <fieldset>
    {legend ? (
      <legend className="text-sm font-medium tracking-tight mb-2">{legend}</legend>
    ) : null}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
      {children}
    </div>
  </fieldset>
);

interface StrengthMeterProps {
  label: string;
  score: 1 | 2 | 3 | 4;
}

export const StrengthMeter = ({ label, score }: StrengthMeterProps) => (
  <div className="flex items-center gap-3 min-w-0 pt-0.5">
    <div className="flex gap-1 flex-1 min-w-0" aria-hidden>
      {[1, 2, 3, 4].map((step) => (
        <span
          key={step}
          className={cn(
            "h-1 flex-1 rounded-full",
            step <= score ? "bg-foreground" : "bg-border"
          )}
        />
      ))}
    </div>
    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
      {label}
    </span>
  </div>
);

interface StatusBannerProps {
  tone: "neutral" | "success" | "error";
  children: ReactNode;
}

export const StatusBanner = ({ tone, children }: StatusBannerProps) => (
  <div
    role={tone === "error" ? "alert" : undefined}
    aria-live="polite"
    className={cn(
      "rounded-xl border px-3 py-2.5 text-sm leading-relaxed",
      tone === "success" && "border-border bg-secondary/50 text-foreground",
      tone === "error" && "border-destructive/30 bg-destructive/5 text-destructive",
      tone === "neutral" && "border-border bg-secondary/30 text-muted-foreground"
    )}
  >
    {children}
  </div>
);

export const StatGrid = ({
  items,
}: {
  items: Array<{ label: string; value: number | string }>;
}) => (
  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {items.map(({ label, value }) => (
      <div
        key={label}
        className="rounded-xl border border-border bg-secondary/30 px-3 py-2.5"
      >
        <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
        <dd className="text-lg font-medium tabular-nums tracking-tight">{value}</dd>
      </div>
    ))}
  </dl>
);

export const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
  legend,
  fullWidth = false,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  legend?: string;
  fullWidth?: boolean;
}) => (
  <fieldset
    className={cn(
      "flex flex-wrap gap-1 p-1 rounded-full bg-secondary/50 backdrop-blur-sm border border-border",
      fullWidth ? "w-full" : "w-fit max-w-full"
    )}
  >
    {legend ? <legend className="sr-only">{legend}</legend> : null}
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        aria-pressed={value === option.value}
        className={cn(
          "px-3 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-200 whitespace-nowrap",
          fullWidth && "flex-1 min-w-0 text-center",
          focusRing,
          value === option.value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {option.label}
      </button>
    ))}
  </fieldset>
);
