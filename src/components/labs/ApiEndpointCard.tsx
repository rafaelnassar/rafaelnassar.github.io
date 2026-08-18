import { useCallback, useState } from "react";
import { Check, Copy, Play, Loader2 } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { TagPill } from "@/components/shared/TagPill";
import { CodeBlock } from "@/components/labs/CodeBlock";
import { cn, focusRing } from "@/lib/utils";
import { copyText } from "@/lib/clipboard";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";
import { getAbsoluteApiUrl, type MockApiEndpoint } from "@/data/mock-apis";

interface ApiEndpointCardProps {
  endpoint: MockApiEndpoint;
}

export const ApiEndpointCard = ({ endpoint }: ApiEndpointCardProps) => {
  const { lang } = useLang();
  const tx = t(lang);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedFetch, setCopiedFetch] = useState(false);

  const absoluteUrl = getAbsoluteApiUrl(endpoint.path);
  const curlCommand = `curl -s "${absoluteUrl}" | jq`;
  const fetchSnippet = `const res = await fetch("${absoluteUrl}");\nconst json = await res.json();`;

  const handleTry = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint.path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch {
      setError(tx.labs.apiFetchError);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint.path, tx.labs.apiFetchError]);

  const handleCopy = async (text: string, setter: (value: boolean) => void) => {
    const ok = await copyText(text);
    if (ok) {
      setter(true);
      window.setTimeout(() => setter(false), 2000);
    }
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
          GET
        </span>
        <code className="text-xs sm:text-sm font-mono text-muted-foreground break-all">
          {endpoint.path}
        </code>
      </div>

      <div>
        <h3 className="font-medium text-base sm:text-lg tracking-tight mb-1">
          {endpoint.title[lang]}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {endpoint.description[lang]}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {endpoint.tags.map((tag) => (
          <TagPill key={tag}>{tag}</TagPill>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleTry}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
            "bg-foreground text-background hover:bg-foreground/90 transition-colors duration-200 cursor-pointer",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            focusRing
          )}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Play className="size-4" aria-hidden />
          )}
          {tx.labs.apiTry}
        </button>

        <button
          type="button"
          onClick={() => handleCopy(absoluteUrl, setCopiedUrl)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
            "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200 cursor-pointer",
            focusRing
          )}
          aria-label={copiedUrl ? tx.labs.copied : tx.labs.apiCopyUrl}
        >
          {copiedUrl ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          <span aria-hidden>{copiedUrl ? tx.labs.copied : tx.labs.apiCopyUrl}</span>
        </button>

        <button
          type="button"
          onClick={() => handleCopy(fetchSnippet, setCopiedFetch)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
            "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200 cursor-pointer",
            focusRing
          )}
          aria-label={copiedFetch ? tx.labs.copied : "fetch"}
        >
          {copiedFetch ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          <span aria-hidden>{copiedFetch ? tx.labs.copied : "fetch"}</span>
        </button>

        <button
          type="button"
          onClick={() => handleCopy(curlCommand, setCopiedCurl)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
            "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200 cursor-pointer",
            focusRing
          )}
          aria-label={copiedCurl ? tx.labs.copied : tx.labs.apiCopyCurl}
        >
          {copiedCurl ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          <span aria-hidden>{copiedCurl ? tx.labs.copied : tx.labs.apiCopyCurl}</span>
        </button>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {response ? <CodeBlock code={response} language="json" /> : null}
    </Card>
  );
};
