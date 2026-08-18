import SpeedTest from "@cloudflare/speedtest";
import type { MeasurementConfig } from "@cloudflare/speedtest";

export type SpeedPhase = "idle" | "ping" | "download" | "upload" | "done" | "error";

export interface SpeedProgress {
  phase: SpeedPhase;
  ratio: number;
  overall: number;
  liveMbps?: number;
  pingMs?: number;
  downloadMbps?: number;
  uploadMbps?: number;
  failedPhase?: Extract<SpeedPhase, "upload">;
}

export interface SpeedResult {
  pingMs: number;
  downloadMbps: number;
  uploadMbps: number;
  failedPhase?: Extract<SpeedPhase, "upload">;
}

const WEIGHTS = { ping: 0.16, download: 0.52, upload: 0.32 } as const;

/** Sequência do motor oficial, sem packet-loss (precisa de TURN) e sem intercalar upload/download. */
const MEASUREMENTS: MeasurementConfig[] = [
  { type: "latency", numPackets: 1 },
  { type: "latency", numPackets: 20 },
  { type: "download", bytes: 1e5, count: 1, bypassMinDuration: true },
  { type: "download", bytes: 1e5, count: 8 },
  { type: "download", bytes: 1e6, count: 6 },
  { type: "download", bytes: 1e7, count: 5 },
  { type: "download", bytes: 2.5e7, count: 4 },
  { type: "download", bytes: 1e8, count: 3 },
  { type: "download", bytes: 2.5e8, count: 2 },
  { type: "upload", bytes: 1e5, count: 8 },
  { type: "upload", bytes: 1e6, count: 6 },
  { type: "upload", bytes: 1e7, count: 4 },
  { type: "upload", bytes: 2.5e7, count: 4 },
  { type: "upload", bytes: 5e7, count: 3 },
];

const PHASE_INDEX = {
  ping: MEASUREMENTS.findIndex((item) => item.type === "latency"),
  download: MEASUREMENTS.findIndex((item) => item.type === "download"),
  upload: MEASUREMENTS.findIndex((item) => item.type === "upload"),
};

const toMbps = (bps?: number): number => {
  if (!bps || bps <= 0) return 0;
  return bps / 1_000_000;
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const overallFrom = (phase: SpeedPhase, ratio: number, step = 0): number => {
  if (phase === "done") return 1;
  const t = clamp01(ratio);
  if (phase === "ping") return WEIGHTS.ping * t;
  if (phase === "download") return WEIGHTS.ping + WEIGHTS.download * t;
  if (phase === "upload") return WEIGHTS.ping + WEIGHTS.download + WEIGHTS.upload * t;
  const total = MEASUREMENTS.length;
  return total ? clamp01(step / total) : 0;
};

const phaseFromType = (type: string): SpeedPhase | null => {
  if (type === "latency") return "ping";
  if (type === "download") return "download";
  if (type === "upload") return "upload";
  return null;
};

const snapshot = (
  engine: SpeedTest,
  phase: SpeedPhase,
  step: number
): Omit<SpeedProgress, "overall"> => {
  const results = engine.results;
  const pingMs = results.getUnloadedLatency();
  const downloadMbps = toMbps(results.getDownloadBandwidth());
  const uploadMbps = toMbps(results.getUploadBandwidth());
  const liveMbps = phase === "upload" ? uploadMbps : downloadMbps;
  const start = PHASE_INDEX[phase] ?? 0;
  const span = Math.max(1, MEASUREMENTS.length - start);
  const ratio = clamp01((step - start + 1) / span);

  return {
    phase,
    ratio,
    liveMbps: liveMbps || undefined,
    pingMs: pingMs != null ? Math.round(pingMs) : undefined,
    downloadMbps: downloadMbps || undefined,
    uploadMbps: uploadMbps || undefined,
  };
};

export const runSpeedTest = (
  onProgress: (progress: SpeedProgress) => void,
  signal: AbortSignal
): Promise<SpeedResult> =>
  new Promise((resolve, reject) => {
    let settled = false;
    let phase: SpeedPhase = "ping";
    let step = 0;

    const engine = new SpeedTest({
      autoStart: false,
      measurements: MEASUREMENTS,
      measureDownloadLoadedLatency: false,
      measureUploadLoadedLatency: false,
      bandwidthFinishRequestDuration: 1800,
      logAimApiUrl: null,
      logMeasurementApiUrl: null,
    });

    const emit = (next: Omit<SpeedProgress, "overall">) => {
      onProgress({ ...next, overall: overallFrom(next.phase, next.ratio, step) });
    };

    const finish = (result: SpeedResult) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", onAbort);
      resolve(result);
    };

    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", onAbort);
      try {
        engine.pause();
      } catch {
        /* already stopped */
      }
      reject(error);
    };

    const onAbort = () => {
      fail(new DOMException("Aborted", "AbortError"));
    };

    if (signal.aborted) {
      onAbort();
      return;
    }
    signal.addEventListener("abort", onAbort, { once: true });

    emit({ phase: "ping", ratio: 0 });

    engine.onPhaseChange = ({ measurementId, measurement }) => {
      step = measurementId;
      const next = phaseFromType(measurement.type);
      if (next) phase = next;
      emit(snapshot(engine, phase, step));
    };

    engine.onResultsChange = ({ type }) => {
      const next = phaseFromType(type);
      if (next) phase = next;
      emit(snapshot(engine, phase, step));
    };

    engine.onFinish = (results) => {
      const pingMs = Math.round(results.getUnloadedLatency() ?? 0);
      const downloadMbps = toMbps(results.getDownloadBandwidth());
      const uploadMbps = toMbps(results.getUploadBandwidth());
      const failedPhase = downloadMbps > 0 && uploadMbps <= 0 ? "upload" : undefined;
      emit({
        phase: "done",
        ratio: 1,
        pingMs,
        downloadMbps,
        uploadMbps,
        failedPhase,
      });
      finish({ pingMs, downloadMbps, uploadMbps, failedPhase });
    };

    engine.onError = () => {
      if (settled || engine.isFinished) return;
      const downloadMbps = toMbps(engine.results.getDownloadBandwidth());
      if (downloadMbps > 0 && !engine.isRunning) {
        const pingMs = Math.round(engine.results.getUnloadedLatency() ?? 0);
        const uploadMbps = toMbps(engine.results.getUploadBandwidth());
        emit({
          phase: "done",
          ratio: 1,
          pingMs,
          downloadMbps,
          uploadMbps,
          failedPhase: uploadMbps <= 0 ? "upload" : undefined,
        });
        finish({
          pingMs,
          downloadMbps,
          uploadMbps,
          failedPhase: uploadMbps <= 0 ? "upload" : undefined,
        });
        return;
      }
      if (downloadMbps <= 0) fail(new Error("speedtest"));
    };

    engine.play();
  });

export const formatMbps = (value: number, locale: string): string =>
  value.toLocaleString(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
