import { defineConfig, devices } from "@playwright/test";

/**
 * Config Playwright — testes E2E rodam contra `vite preview` (build de
 * produção). Garante paridade com o que o usuário vê no GitHub Pages.
 *
 * Pré-requisito: `npm run build` antes (o script `test:e2e` no package.json
 * já faz build + roda o preview via webServer abaixo).
 *
 * Apenas Chromium é usado: portfolios estáticos não precisam matrix completa
 * de browsers; matrix multiplica tempo de teste sem aumentar significativamente
 * a confiança pra esse tipo de site.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    /*
     * locale pt-BR garante que `navigator.language` retorne 'pt-BR' nos
     * testes — o `getInitialLang()` em src/lib/i18n.tsx fallback pra browser
     * locale quando localStorage está vazio. Sem isso, Chromium default é
     * en-US e os testes começam em inglês, quebrando assertions de copy PT.
     */
    locale: "pt-BR",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],

  webServer: {
    command: "npx vite preview --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
