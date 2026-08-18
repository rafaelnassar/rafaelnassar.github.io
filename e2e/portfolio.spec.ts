import { expect, test } from "@playwright/test";

/**
 * Testes E2E do portfolio. Cobrem golden paths críticos:
 *  - Hero renderiza com pitch correto (especialização visível)
 *  - Skip link aparece com Tab e leva pro main (a11y WCAG 2.4.1)
 *  - Theme toggle alterna e persiste em reload
 *  - Language toggle alterna PT↔EN e persiste em reload
 *  - Mobile menu abre/fecha com ESC + devolve foco ao botão (WAI-ARIA)
 *  - Active section atualiza ao scrollar (IntersectionObserver)
 *  - /cv carrega com folha A4 visível
 *  - Rota inexistente cai no NotFound
 *
 * Não cobrem (out of scope dessa rodada):
 *  - Autoplay do carrossel de Clients (timing-dependent, flake risk)
 *  - Visual regression (precisa de baselines + ajuste a cada copy change)
 *  - Geração do PDF (rodada separada via scripts/build-cv.mjs)
 */

test.describe("Hero", () => {
  test("renderiza com pitch de especialização e CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Rafael Nassar", level: 1 })).toBeVisible();
    // Pitch deve mencionar emissão fiscal — diferenciador no mercado BR.
    // Procuramos o trecho "NFCe, NFe e MDFe" / "NFCe, NFe, MDFe" em qualquer
    // idioma usando matchers separados (mais robusto que regex multiline).
    const intro = page.getByLabel(/Introdução|Introduction/);
    await expect(intro).toContainText("NFCe");
    await expect(intro).toContainText("MDFe");
    // CTAs principais (icon-only buttons usam aria-label fixo)
    await expect(page.getByRole("link", { name: "GitHub" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "LinkedIn" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Currículo|Resume/ })).toBeVisible();
  });
});

test.describe("Acessibilidade", () => {
  test("skip link aparece via Tab e leva pro #conteudo", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", {
      name: /Pular para o conteúdo|Skip to main content/,
    });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute("href", "#conteudo");
  });
});

test.describe("Theme toggle", () => {
  test("alterna dark mode e persiste em reload", async ({ page }) => {
    await page.goto("/");
    // Estado inicial: garantir light (limpa localStorage e re-mount)
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();

    // Header renderiza o toggle 2x no DOM (desktop + mobile via responsive
    // wrappers). Pegar o primeiro visível com .first() resolve sem precisar
    // alternar viewport entre testes.
    const toggle = page
      .getByRole("button", { name: /Ativar modo escuro|Switch to dark mode/ })
      .first();
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Cleanup pra não vazar pra outros testes
    await page.evaluate(() => localStorage.setItem("theme", "light"));
  });
});

test.describe("Language toggle", () => {
  test("alterna PT → EN, propaga texto e persiste em reload", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("lang"));
    await page.reload();

    // Mesma situação do theme toggle: 2 instâncias no DOM (desktop + mobile).
    // .first() pega o atualmente visível.
    const toggle = page
      .getByRole("button", { name: /Mudar para inglês|Switch to English/ })
      .first();
    await toggle.click();

    // Após o fade (~360ms), página em inglês
    await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
    const intro = page.getByLabel("Introduction");
    await expect(intro).toContainText("I build web and mobile apps");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
    await expect(page.getByLabel("Introduction")).toContainText(
      "I build web and mobile apps"
    );
  });
});

test.describe("Mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("abre, fecha com ESC e devolve foco ao botão (a11y)", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /Abrir menu|Open menu/ });
    await menuButton.click();

    // Dialog deve estar aberto e ter aria-modal
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");

    // ESC fecha
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    // Foco volta pro botão (WAI-ARIA dialog pattern)
    await expect(menuButton).toBeFocused();
  });
});

test.describe("Navegação por seção", () => {
  test("active section atualiza ao scrollar pra Sobre", async ({ page }) => {
    await page.goto("/");
    // Garantir desktop pra ter nav visível (o teste mobile já cobre menu)
    await page.setViewportSize({ width: 1280, height: 800 });

    // Antes de scrollar, nenhum link tem font-medium (active)
    const aboutSection = page.locator("#sobre");
    await aboutSection.scrollIntoViewIfNeeded();

    // O IntersectionObserver precisa de 1-2 frames pra reagir
    await page.waitForTimeout(800);

    // Link "Sobre" no nav deve estar com text-foreground + font-medium
    const aboutLink = page.locator('nav a[href="#sobre"]').first();
    await expect(aboutLink).toHaveClass(/text-foreground/);
  });
});

test.describe("Página /cv", () => {
  test("renderiza folha A4 + toolbar", async ({ page }) => {
    await page.goto("/cv");
    // Toolbar tem "Voltar ao portfolio" + "Baixar PDF"
    await expect(page.getByRole("link", { name: /Voltar ao portfolio|Back to portfolio/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Baixar PDF|Download PDF/ })).toBeVisible();
    // Documento principal carregou (h1 com nome)
    await expect(
      page.getByRole("heading", { name: "Rafael Nassar", level: 1 })
    ).toBeVisible();
  });
});

test.describe("Rotas", () => {
  test("rota inexistente cai no NotFound", async ({ page }) => {
    const response = await page.goto("/nao-existe");
    // SPA: status pode ser 200 do index.html, mas conteúdo é o NotFound
    expect(response?.status()).toBeLessThan(500);
    // Heading "404" é mais específico que getByText (que casava em <h1> e <p>)
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  });
});

test.describe("Labs", () => {
  test("barra superior separa ferramentas, scripts, docs e api", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/labs");
    await expect(page).toHaveURL(/\/labs\/ferramentas$/);
    await expect(page.getByRole("heading", { name: /Ferramentas/ })).toBeVisible();

    const labsNav = page.getByRole("navigation", { name: /Navegação do Labs/ });
    await expect(labsNav.getByRole("link", { name: "Ferramentas" })).toBeVisible();
    await expect(labsNav.getByRole("link", { name: "Scripts" })).toBeVisible();
    await expect(labsNav.getByRole("link", { name: "Docs" })).toBeVisible();
    await expect(labsNav.getByRole("link", { name: "API" })).toBeVisible();

    await labsNav.getByRole("link", { name: "Scripts" }).click();
    await expect(page).toHaveURL(/\/labs\/scripts$/);
    await expect(page.getByRole("heading", { name: /Scripts/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Supabase self-host/ })).toBeVisible();

    await labsNav.getByRole("link", { name: "Docs" }).click();
    await expect(page).toHaveURL(/\/labs\/docs$/);
    await expect(page.getByRole("heading", { name: /Documentação/ })).toBeVisible();

    await labsNav.getByRole("link", { name: "API" }).click();
    await expect(page).toHaveURL(/\/labs\/api$/);
    await expect(page.getByRole("heading", { name: /APIs mock/ })).toBeVisible();
  });

  test("ferramentas paginam por categoria", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/labs/ferramentas");

    await expect(page.getByRole("group", { name: /Categoria de ferramentas/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Geradores", pressed: true })).toBeVisible();

    const toolLinks = page.locator('a[href^="/labs/ferramentas/"]');
    await expect(toolLinks).toHaveCount(4);

    await page.getByRole("button", { name: "Validadores" }).click();
    await expect(page).toHaveURL(/aba=validator/);
    await expect(toolLinks).toHaveCount(3);

    await page.getByRole("button", { name: "Utilitários" }).click();
    await expect(page).toHaveURL(/aba=utility/);
    await expect(toolLinks).toHaveCount(4);
    await expect(page.getByRole("heading", { name: "Sorteador de números" })).toBeVisible();

    await page.goto("/labs/ferramentas?aba=generator&pagina=2");
    await expect(page.getByRole("navigation", { name: /Paginação de ferramentas/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Página 2/ })).toHaveAttribute("aria-current", "page");
    await expect(toolLinks).toHaveCount(4);
  });

  test("gerador de senha e gerador de CPF funcionam no browser", async ({ page }) => {
    await page.goto("/labs/ferramentas/gerador-de-senha");
    await expect(page.getByRole("heading", { name: /Gerador de senha/ })).toBeVisible();
    const generate = page.getByRole("button", { name: /^Gerar$/ });
    await generate.click();
    await expect(page.getByRole("button", { name: /Copiar/ })).toBeEnabled();

    await page.goto("/labs/ferramentas/gerador-cpf-cnpj");
    await expect(page.getByRole("heading", { name: /Gerador CPF \/ CNPJ/ })).toBeVisible();
    await expect(page.getByText(/\d{3}\.\d{3}\.\d{3}-\d{2}/)).toBeVisible();
  });
});
