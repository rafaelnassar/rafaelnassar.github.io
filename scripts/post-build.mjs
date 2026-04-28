#!/usr/bin/env node
/**
 * Post-build: SPA fallback para GitHub Pages.
 *
 * GitHub Pages serve arquivos estáticos. Quando alguém acessa /cv direto,
 * Pages procura `/cv/index.html`, não acha, e serve `404.html` automaticamente.
 *
 * Solução: copiar `dist/index.html` para `dist/404.html`. Resultado:
 *   - Acessar https://rafaelnassar.github.io/cv → Pages serve 404.html (= index.html)
 *   - React Router monta, lê window.location.pathname (= "/cv")
 *   - Renderiza a rota correta
 *   - Status HTTP volta como 200 do ponto de vista do React Router
 *
 * Mesmo truque usado por sites SPA + Pages há anos. Sem precisar de hash routing.
 */

import { copyFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const INDEX = resolve(DIST, "index.html");
const NOT_FOUND = resolve(DIST, "404.html");

if (!existsSync(INDEX)) {
  console.error("✗ dist/index.html não existe — rode `vite build` primeiro");
  process.exit(1);
}

copyFileSync(INDEX, NOT_FOUND);
console.log("✓ dist/404.html criado (SPA fallback para GitHub Pages)");
