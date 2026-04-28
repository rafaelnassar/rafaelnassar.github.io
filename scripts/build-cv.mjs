#!/usr/bin/env node
/**
 * Gera public/curriculo.pdf a partir da rota /cv via Chrome headless.
 *
 * Fluxo:
 *  1. Localiza o binário do Chrome (Win/Mac/Linux) ou usa $CHROME_PATH
 *  2. Build do projeto com Vite (se ainda não houver `dist/`)
 *  3. Sobe `vite preview` em porta livre como subprocess
 *  4. Aguarda servidor responder 200 em /cv
 *  5. Roda Chrome headless com --print-to-pdf, gera curriculo.pdf
 *  6. Mata o subprocess do preview
 *
 * Uso:
 *   bun run cv:build       # build + preview + headless + PDF
 *   CHROME_PATH=... bun run cv:build  # custom Chrome
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = resolve(PROJECT_ROOT, "public");
const PDF_PATH = resolve(PUBLIC_DIR, "curriculo.pdf");
const PORT = 4181; // porta dedicada — evita colisão com preview manual
// ?theme=light força light mode antes do React montar (lido pelo script inline
// do index.html). Garante que o PDF gerado tenha fundo branco/claro mesmo se o
// runner ou OS tiver dark mode ativo — a flag --force-prefers-color-scheme=light
// do Chrome sozinha é ignorada pelo headless=new (bug conhecido).
const CV_URL = `http://localhost:${PORT}/cv?theme=light`;

// ────────────────────────────────────────────────────────────────────────
// 1. Locate Chrome
// ────────────────────────────────────────────────────────────────────────

const chromeCandidates = [
  process.env.CHROME_PATH,
  // Windows
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  process.env.LOCALAPPDATA &&
    `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  // macOS
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  // Linux
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const chromePath = chromeCandidates.find((p) => {
  try {
    return existsSync(p);
  } catch {
    return false;
  }
});

if (!chromePath) {
  console.error("✗ Chrome não encontrado. Defina CHROME_PATH:");
  console.error("  CHROME_PATH=/caminho/chrome bun run cv:build");
  process.exit(1);
}

console.log(`→ Chrome: ${chromePath}`);

// ────────────────────────────────────────────────────────────────────────
// 2. Build (se não houver dist/)
// ────────────────────────────────────────────────────────────────────────

const distExists = existsSync(resolve(PROJECT_ROOT, "dist/index.html"));
if (!distExists || process.argv.includes("--rebuild")) {
  console.log("→ Build...");
  const build = spawnSync("npx", ["vite", "build"], {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    shell: true,
  });
  if (build.status !== 0) {
    console.error("✗ Build falhou");
    process.exit(build.status ?? 1);
  }
}

// ────────────────────────────────────────────────────────────────────────
// 3. Sobe vite preview
// ────────────────────────────────────────────────────────────────────────

console.log(`→ Iniciando preview em :${PORT}...`);
const preview = spawn(
  "npx",
  ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { cwd: PROJECT_ROOT, shell: true, stdio: ["ignore", "pipe", "pipe"] }
);

// Cleanup garantido em qualquer exit path
const killPreview = () => {
  if (preview.pid && !preview.killed) {
    try {
      if (process.platform === "win32") {
        spawnSync("taskkill", ["/F", "/T", "/PID", String(preview.pid)]);
      } else {
        preview.kill("SIGTERM");
      }
    } catch {
      /* noop */
    }
  }
};
process.on("exit", killPreview);
process.on("SIGINT", () => {
  killPreview();
  process.exit(130);
});

// ────────────────────────────────────────────────────────────────────────
// 4. Aguarda servidor pronto
// ────────────────────────────────────────────────────────────────────────

const waitForServer = async () => {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(CV_URL);
      if (res.ok) return true;
    } catch {
      /* retry */
    }
    await sleep(300);
  }
  return false;
};

const ready = await waitForServer();
if (!ready) {
  console.error("✗ Preview não respondeu em 30s");
  killPreview();
  process.exit(1);
}
console.log("→ Preview pronto");

// ────────────────────────────────────────────────────────────────────────
// 5. Chrome headless → PDF
// ────────────────────────────────────────────────────────────────────────

if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

console.log("→ Renderizando PDF (10s para hidratação React + Google Fonts)...");
const chromeArgs = [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  // Força light mode no nível do Chrome (proteção em camadas — o /cv também
  // remove `class="dark"` no useEffect, mas a flag aqui garante que mesmo
  // se algum token dependente de tema escapar, o resultado fica claro).
  "--force-prefers-color-scheme=light",
  "--virtual-time-budget=10000",
  "--run-all-compositor-stages-before-draw",
  "--hide-scrollbars",
  `--print-to-pdf=${PDF_PATH}`,
  CV_URL,
];

const chrome = spawnSync(chromePath, chromeArgs, {
  cwd: PROJECT_ROOT,
  stdio: ["ignore", "pipe", "pipe"],
});

killPreview();

if (chrome.status !== 0) {
  console.error("✗ Chrome falhou:");
  console.error(chrome.stderr?.toString());
  process.exit(chrome.status ?? 1);
}

// ────────────────────────────────────────────────────────────────────────
// 6. Relatório
// ────────────────────────────────────────────────────────────────────────

if (!existsSync(PDF_PATH)) {
  console.error("✗ PDF não foi gerado");
  process.exit(1);
}

const { size } = statSync(PDF_PATH);
const sizeKb = (size / 1024).toFixed(1);

if (size < 5_000) {
  console.error(
    `✗ PDF muito pequeno (${sizeKb} KB) — provavelmente vazio. ` +
      `Veja se o vite preview está servindo /cv corretamente.`
  );
  process.exit(1);
}

console.log(`✓ ${PDF_PATH}`);
console.log(`  ${sizeKb} KB`);
process.exit(0);
