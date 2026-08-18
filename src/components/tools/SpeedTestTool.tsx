import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const RADIUS = 96;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC = 0.72;
const DASH = CIRCUMFERENCE * ARC;
const LERP = 0.07;
/** Escala de velocímetro (tipo Ookla): mais resolução em baixas velocidades, 1 Gbps no fim. */
const SPEED_MARKS = [0, 10, 25, 50, 100, 250, 500, 1000];

const speedToPct = (mbps: number): number => {
  if (mbps <= 0) return 0;
  const last = SPEED_MARKS[SPEED_MARKS.length - 1] ?? 1000;
  if (mbps >= last) return 1;
  for (let i = 1; i < SPEED_MARKS.length; i += 1) {
    const hi = SPEED_MARKS[i] ?? last;
    const lo = SPEED_MARKS[i - 1] ?? 0;
    if (mbps <= hi) {
      const t = (mbps - lo) / Math.max(1, hi - lo);
      return (i - 1 + t) / (SPEED_MARKS.length - 1);
    }
  }
  return 1;
};

const arcPoint = (t: number, radius: number): { x: number; y: number } => {
  const rad = ((143 + t * ARC * 360) * Math.PI) / 180;
  return { x: 120 + radius * Math.cos(rad), y: 128 + radius * Math.sin(rad) };
};

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
  const ringTarget =
    phase === "idle" || phase === "error"
      ? 0
      : gaugeUnit === "mbps"
        ? speedToPct(gaugeTarget)
        : progress.ratio;
  const ring = useSmoothNumber(ringTarget, running || phase === "done", reduceMotion, String(runId));
  const offset = DASH * (1 - Math.min(1, Math.max(0, ring)));
  const display = formatGauge(shown, gaugeUnit);
  const empty = display === "—";

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
          className="rounded-2xl border border-border bg-secondary/20 px-4 py-8 sm:px-6 sm:py-10"
          aria-busy={running}
        >
          <div className="relative mx-auto flex size-[200px] sm:size-[220px] items-center justify-center">
            <svg
              viewBox="0 0 240 240"
              className="absolute inset-0 size-full text-foreground"
              aria-hidden
            >
              <g transform="translate(120 128) rotate(143)">
                <circle
                  r={RADIUS}
                  fill="none"
                  className="stroke-border"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${DASH} ${CIRCUMFERENCE}`}
                />
                <circle
                  r={RADIUS}
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${DASH} ${CIRCUMFERENCE}`}
                  strokeDashoffset={offset}
                  style={{
                    transition: reduceMotion ? undefined : "stroke-dashoffset 120ms linear",
                  }}
                />
              </g>
              {gaugeUnit === "mbps"
                ? (
                    [
                      { t: 0, label: "0" },
                      { t: speedToPct(100), label: "100" },
                      { t: 1, label: "1G" },
                    ] as const
                  ).map(({ t, label }) => {
                    const point = arcPoint(t, 114);
                    return (
                      <text
                        key={label}
                        x={point.x}
                        y={point.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-muted-foreground"
                        fontSize="9"
                      >
                        {label}
                      </text>
                    );
                  })
                : null}
            </svg>

            <div className="relative z-[1] flex flex-col items-center pt-3" aria-hidden>
              <p
                className={cn(
                  "text-5xl sm:text-6xl font-medium tabular-nums tracking-tighter leading-none",
                  empty && "text-muted-foreground"
                )}
              >
                {display}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {gaugeUnit === "ms" ? tx.tools.speedMs : tx.tools.speedMbps}
              </p>
            </div>
          </div>

          {resultSummary ? <p className="sr-only">{resultSummary}</p> : null}

          <p
            className="mt-5 text-center text-sm text-muted-foreground min-h-5"
            role="status"
            aria-atomic="true"
          >
            {phaseCopy}
          </p>

          <ol
            className="mt-6 flex items-center justify-center gap-5 sm:gap-8"
            aria-label={tx.tools.speedTesting}
          >
            {STEPS.map((item, index) => {
              const currentIndex = STEPS.indexOf(
                phase === "done" ? (uploadFailed ? "download" : "upload") : phase
              );
              const failed = uploadFailed && item === "upload";
              const done = !failed && (phase === "done" || (running && index < currentIndex));
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
                {phase === "done" || phase === "error" ? tx.tools.speedAgain : tx.tools.speedStart}
              </Button>
            )}
          </ToolActions>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {STEPS.map((item) => {
            const metric = metricValue(item);
            const filled = metric.value !== "—";
            const active = running && item === phase;
            const Icon = STEP_ICONS[item];
            return (
              <div
                key={item}
                className={cn(
                  "rounded-xl border bg-background px-2.5 py-3 sm:px-3 sm:py-3.5 transition-colors duration-300",
                  active && "border-foreground/25",
                  filled && !active && "border-border",
                  !filled && !active && "border-border opacity-55"
                )}
              >
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
                  <Icon className="size-3 shrink-0" aria-hidden />
                  {stepLabel(item)}
                </p>
                <p className="text-lg sm:text-2xl font-medium tabular-nums tracking-tight">
                  {metric.value}
                  <span className="ml-1 text-[11px] font-normal text-muted-foreground">
                    {metric.unit}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {phase === "error" ? (
          <StatusBanner tone="error">{tx.tools.speedError}</StatusBanner>
        ) : uploadFailed ? (
          <StatusBanner tone="neutral">{tx.tools.speedUploadFailed}</StatusBanner>
        ) : null}
      </div>
    </ToolPanel>
  );
};
