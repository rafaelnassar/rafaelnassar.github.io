import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock = ({ code, language, className }: CodeBlockProps) => {
  const { lang } = useLang();
  const tx = t(lang);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard pode falhar em contextos sem permissão — silencioso.
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-secondary/40 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2 border-b border-border/80">
        <span className="text-xs font-mono text-muted-foreground lowercase">
          {language ?? "shell"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
            "text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200 cursor-pointer",
            focusRing
          )}
          aria-label={copied ? tx.labs.copied : tx.labs.copy}
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          <span aria-hidden>{copied ? tx.labs.copied : tx.labs.copy}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-3 sm:p-4 text-sm leading-relaxed">
        <code className="font-mono text-[13px] sm:text-sm text-foreground">
          {code}
        </code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {copied ? tx.labs.copied : ""}
      </span>
    </div>
  );
};
