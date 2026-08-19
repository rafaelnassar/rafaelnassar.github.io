import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Check, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StatusBanner,
  ToolActions,
  ToolPanel,
  toolStackClassName,
} from "@/components/tools/shared";
import {
  formatMbps,
  runSpeedTest,
  type SpeedPhase,
  type SpeedProgress,
  type SpeedResult,
} from "@/lib/tools/speed-test";
import { durations, easings } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const LERP = 0.07;

const STEPS: Array<Extract<SpeedPhase, "ping" | "download" | "upload">> = [
  "ping",
  "download",
  "upload",
];

const STEP_ICONS = {
  ping: Timer,
  download: ArrowDownToLine,
  upload: ArrowUpFromLine,
};

const useSmoothNumber = (
  target: number,
  enabled: boolean,
  reduceMotion: boolean,
  resetKey?: string
) => {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (!resetKey) return;
    current.current = 0;
    setValue(0);
  }, [resetKey]);

  useEffect(() => {
    if (reduceMotion || !enabled) {
      current.current = target;
      setValue(target);
      return;
    }

    let frame = 0;
    const tick = () => {
      const next = current.current + (target - current.current) * LERP;
      const settled = Math.abs(target - next) < (target >= 20 ? 0.08 : 0.02);
      current.current = settled ? target : next;
      setValue(current.current);
      if (!settled) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, reduceMotion]);

  return value;
};

const formatGauge = (value: number, unit: "ms" | "mbps"): string => {
  if (value <= 0) return "—";
  if (unit === "ms") {
    const rounded = Math.round(value);
    return rounded <= 0 ? "—" : String(rounded);
  }
  if (value < 10) return value.toFixed(1);
  return String(Math.round(value));
};

export const SpeedTestTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const reduceMotion = Boolean(useReducedMotion());
  const [phase, setPhase] = useState<SpeedPhase>("idle");
  const [progress, setProgress] = useState<SpeedProgress>({
    phase: "idle",
    ratio: 0,
    overall: 0,
  });
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [runId, setRunId] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const running = phase === "ping" || phase === "download" || phase === "upload";

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    []
  );

  const start = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRunId((id) => id + 1);
    setResult(null);
    setPhase("ping");
    setProgress({ phase: "ping", ratio: 0, overall: 0 });
    try {
      const next = await runSpeedTest((update) => {
        if (abortRef.current !== controller) return;
        setPhase(update.phase);
        setProgress(update);
      }, controller.signal);
      if (abortRef.current !== controller) return;
      setResult(next);
      setPhase("done");
      setProgress({ phase: "done", ratio: 1, overall: 1, ...next });
    } catch {
      if (abortRef.current !== controller) return;
      if (controller.signal.aborted) {
        setPhase("idle");
        setProgress({ phase: "idle", ratio: 0, overall: 0 });
        return;
      }
      setPhase("error");
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    setRunId((id) => id + 1);
    setPhase("idle");
    setProgress({ phase: "idle", ratio: 0, overall: 0 });
    setResult(null);
  };

  const uploadFailed = result?.failedPhase === "upload" || progress.failedPhase === "upload";
  const ping = result?.pingMs ?? progress.pingMs;
  const down = result?.downloadMbps ?? progress.downloadMbps ?? 0;
  const up = result?.uploadMbps ?? progress.uploadMbps ?? 0;
  const live =
    phase === "download"
      ? (progress.liveMbps ?? down)
      : phase === "upload"
        ? (progress.liveMbps ?? up)
        : down || up;

  const gaugeUnit = phase === "ping" ? "ms" : "mbps";
  const gaugeTarget =
    phase === "idle"
      ? 0
      : phase === "error"
        ? 0
        : phase === "ping"
          ? (progress.pingMs ?? 0)
          : phase === "upload"
            ? (progress.liveMbps ?? up)
            : down || live;

  const shown = useSmoothNumber(
    gaugeTarget,
    running || phase === "done",
    reduceMotion,
    `${runId}-${gaugeUnit}`
  );
  const display = formatGauge(shown, gaugeUnit);
  const empty = display === "—";
  const finished = phase === "done";
  const stageMotion = reduceMotion
    ? { duration: 0 }
    : { duration: durations.short, ease: easings.swift };

  const phaseCopy =
    phase === "ping"
      ? tx.tools.speedPhasePing
      : phase === "download"
        ? tx.tools.speedPhaseDownload
        : phase === "upload"
          ? tx.tools.speedPhaseUpload
          : phase === "done"
            ? uploadFailed
              ? tx.tools.speedPartial
              : tx.tools.speedDone
            : phase === "error"
              ? tx.tools.speedFailedShort
              : tx.tools.speedIdleShort;

  const stepLabel = (item: (typeof STEPS)[number]) => {
    if (item === "ping") return tx.tools.speedPing;
    if (item === "download") return tx.tools.speedDownload;
    return tx.tools.speedUpload;
  };

  const metricValue = (
    item: (typeof STEPS)[number]
  ): { value: string; unit: string } => {
    if (item === "ping") {
      return {
        value: ping != null ? String(ping) : "—",
        unit: tx.tools.speedMs,
      };
    }
    if (item === "download") {
      return {
        value: down ? formatMbps(down, locale) : "—",
        unit: tx.tools.speedMbps,
      };
    }
    return {
      value: up ? formatMbps(up, locale) : "—",
      unit: tx.tools.speedMbps,
    };
  };

  const resultSummary =
    phase === "done" && ping != null
      ? `${ping} ${tx.tools.speedMs}, ${formatMbps(down, locale)} ${tx.tools.speedMbps} ${tx.tools.speedDownload}, ${
          up ? `${formatMbps(up, locale)} ${tx.tools.speedMbps}` : "—"
        } ${tx.tools.speedUpload}`
      : null;

  return (
    <ToolPanel className="hover:shadow-none hover:border-border">
      <div className={toolStackClassName}>
        <div
          className={cn(
            "grid overflow-hidden motion-reduce:transition-none",
            finished
              ? "pointer-events-none grid-rows-[0fr] opacity-0 duration-200 ease-in"
              : "grid-rows-[1fr] opacity-100 duration-300 ease-out"
          )}
          style={{
            transitionProperty: reduceMotion ? "none" : "grid-template-rows, opacity",
          }}
          aria-hidden={finished}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className="rounded-2xl border border-border bg-secondary/20 px-4 py-8 sm:px-6 sm:py-10"
              aria-busy={running}
            >
              <div className="flex flex-col items-center text-center">
                <p
                  className={cn(
                    "text-4xl sm:text-6xl font-medium tabular-nums tracking-tighter leading-none",
                    empty && "text-muted-foreground"
                  )}
                  aria-hidden
                >
                  {display}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {gaugeUnit === "ms" ? tx.tools.speedMs : tx.tools.speedMbps}
                </p>
              </div>

              <p
                className="mt-5 min-h-5 text-center text-sm text-muted-foreground"
                role="status"
                aria-atomic="true"
              >
                {phaseCopy}
              </p>

              <ol
                className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-8"
                aria-label={tx.tools.speedTesting}
              >
                {STEPS.map((item, index) => {
                  const currentIndex = STEPS.indexOf(
                    finished ? (uploadFailed ? "download" : "upload") : phase
                  );
                  const failed = uploadFailed && item === "upload";
                  const done = !failed && (finished || (running && index < currentIndex));
                  const active = running && item === phase;
                  return (
                    <li
                      key={item}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium tracking-wide",
                        active && "text-foreground",
                        done && !active && "text-foreground/80",
                        failed && "text-destructive",
                        !active && !done && !failed && "text-muted-foreground"
                      )}
                    >
                      {done ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : (
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            active && "bg-foreground motion-reduce:animate-none animate-pulse",
                            !active && "bg-border"
                          )}
                          aria-hidden
                        />
                      )}
                      {stepLabel(item)}
                    </li>
                  );
                })}
              </ol>

              <ToolActions className="justify-center pt-8">
                {running ? (
                  <Button type="button" variant="outline" className="min-h-11" onClick={cancel}>
                    {tx.tools.speedCancel}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size={phase === "idle" ? "lg" : "default"}
                    className="min-h-11"
                    onClick={() => void start()}
                  >
                    {phase === "error" ? tx.tools.speedAgain : tx.tools.speedStart}
                  </Button>
                )}
              </ToolActions>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-3 items-stretch gap-2 sm:gap-3">
          {STEPS.map((item) => {
            const metric = metricValue(item);
            const filled = metric.value !== "—";
            const active = running && item === phase;
            const Icon = STEP_ICONS[item];
            return (
              <div
                key={item}
                className={cn(
                  "flex h-full min-w-0 flex-col items-center justify-center text-center rounded-xl border bg-background px-2 py-3 sm:px-3",
                  finished ? "border-foreground/15 py-4 sm:py-5" : "sm:py-3.5",
                  active && "border-foreground/25",
                  filled && !active && !finished && "border-border",
                  !filled && !active && "border-border opacity-55"
                )}
              >
                <p className="flex h-4 max-w-full items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground sm:h-5 sm:gap-1.5 sm:text-[11px]">
                  <Icon className="size-3 shrink-0" aria-hidden />
                  <span className="whitespace-nowrap">{stepLabel(item)}</span>
                </p>
                <p
                  className={cn(
                    "mt-2 font-medium tabular-nums tracking-tight leading-none",
                    finished ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                  )}
                >
                  {metric.value}
                </p>
                <p className="mt-1.5 text-[11px] leading-none text-muted-foreground">
                  {metric.unit}
                </p>
              </div>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {finished ? (
            <motion.div
              key="speed-again"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{
                ...stageMotion,
                delay: reduceMotion ? 0 : durations.micro,
              }}
            >
              <ToolActions className="justify-center pt-2">
                <Button type="button" className="min-h-11" onClick={() => void start()}>
                  {tx.tools.speedAgain}
                </Button>
              </ToolActions>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {finished && resultSummary ? (
          <p className="sr-only" aria-live="polite">
            {phaseCopy}. {resultSummary}
          </p>
        ) : null}

        {phase === "error" ? (
          <StatusBanner tone="error">{tx.tools.speedError}</StatusBanner>
        ) : uploadFailed ? (
          <StatusBanner tone="neutral">{tx.tools.speedUploadFailed}</StatusBanner>
        ) : null}
      </div>
    </ToolPanel>
  );
};
