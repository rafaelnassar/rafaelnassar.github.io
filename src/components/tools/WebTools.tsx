import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  Field,
  ResultBlock,
  ResultInline,
  StatGrid,
  StatusBanner,
  ToolActions,
  ToolPanel,
  fieldClassName,
  textareaClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import { generateMetaTags } from "@/lib/tools/meta-tags";
import { enrichOs, fetchPublicIp, parseBrowser, parseOs, type OsInfo } from "@/lib/tools/user-agent";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const MetaTagsGenerator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const output = useMemo(
    () => generateMetaTags({ title, author, keywords, description, url }),
    [title, author, keywords, description, url]
  );

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <Field id="meta-title" label={`${tx.tools.metaTitle} (${title.length})`}>
          <input id="meta-title" value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClassName} />
        </Field>
        <Field id="meta-author" label={`${tx.tools.metaAuthor} (${author.length})`}>
          <input id="meta-author" value={author} onChange={(e) => setAuthor(e.target.value)} className={fieldClassName} />
        </Field>
        <Field id="meta-keywords" label={`${tx.tools.metaKeywords} (${keywords.length})`}>
          <input id="meta-keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} className={fieldClassName} />
        </Field>
        <Field id="meta-description" label={`${tx.tools.metaDescription} (${description.length})`}>
          <textarea
            id="meta-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={textareaClassName}
          />
        </Field>
        <Field id="meta-url" label={tx.tools.metaUrl} hint={tx.tools.metaUrlHint}>
          <input id="meta-url" value={url} onChange={(e) => setUrl(e.target.value)} className={fieldClassName} />
        </Field>
        <ResultBlock label={tx.tools.output} value={output} />
      </div>
    </ToolPanel>
  );
};

export const QrCodeGenerator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [text, setText] = useState("https://");
  const [size, setSize] = useState(256);
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl("");
      return;
    }
    QRCode.toDataURL(text, { width: size, margin: 2 })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [text, size]);

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <Field id="qr-text" label={tx.tools.input}>
          <textarea
            id="qr-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className={textareaClassName}
          />
        </Field>
        <Field id="qr-size" label={`${tx.tools.qrSize}: ${size}px`}>
          <input
            id="qr-size"
            type="range"
            min={128}
            max={512}
            step={32}
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="w-full accent-foreground cursor-pointer"
          />
        </Field>
        {dataUrl ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4">
            <img src={dataUrl} alt={tx.tools.qrPreview} width={size} height={size} className="max-w-full h-auto" />
            <a
              href={dataUrl}
              download="qrcode.png"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {tx.tools.qrDownload}
            </a>
          </div>
        ) : (
          <StatusBanner tone="neutral">{tx.tools.qrEmpty}</StatusBanner>
        )}
      </div>
    </ToolPanel>
  );
};

export const MyIpTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchPublicIp().then((result) => {
      setIp(result.ip);
      setError(Boolean(result.error));
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <ResultInline label={tx.tools.myIp} value={loading ? "…" : ip} />
        <p className="text-xs text-muted-foreground">{tx.tools.myIpHint}</p>
        {error ? <StatusBanner tone="error">{tx.tools.myIpError}</StatusBanner> : null}
        <ToolActions>
          <Button type="button" variant="outline" onClick={load} disabled={loading}>
            {tx.tools.check}
          </Button>
        </ToolActions>
      </div>
    </ToolPanel>
  );
};

export const MyBrowserTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const info = parseBrowser();

  return (
    <ToolPanel>
      <StatGrid
        items={[
          { label: tx.tools.browserName, value: info.name },
          { label: tx.tools.browserVersion, value: info.version || "—" },
          { label: tx.tools.browserLanguage, value: info.language },
          { label: tx.tools.browserOnline, value: info.online ? (lang === "pt" ? "Sim" : "Yes") : (lang === "pt" ? "Não" : "No") },
        ]}
      />
      <ResultBlock label={tx.tools.userAgent} value={info.userAgent} mono={false} />
    </ToolPanel>
  );
};

export const MyOsTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [info, setInfo] = useState<OsInfo>(() => parseOs());

  useEffect(() => {
    let cancelled = false;
    void enrichOs(parseOs()).then((next) => {
      if (!cancelled) setInfo(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ToolPanel>
      <StatGrid
        items={[
          { label: tx.tools.osName, value: info.name },
          { label: tx.tools.osVersion, value: info.version || "—" },
          { label: tx.tools.osPlatform, value: info.architecture },
          { label: tx.tools.osCores, value: info.cores || "—" },
          { label: tx.tools.osMemory, value: info.memoryGb || (info.memoryUnavailable === "insecure" ? tx.tools.osMemoryHttp : tx.tools.osMemoryUnavailable) },
          { label: tx.tools.osTouch, value: info.touchPoints },
        ]}
      />
    </ToolPanel>
  );
};

