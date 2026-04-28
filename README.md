# Rafael Nassar — Portfolio

Portfolio pessoal em **React + Vite + TypeScript + Tailwind**.
Online: [rafaelnassar.github.io](https://rafaelnassar.github.io)

---

## Desenvolvimento

```bash
bun install
bun run dev          # servidor local (porta 8080)
bun run build        # build de produção (gera dist/ + 404.html)
bun run preview      # serve dist/ localmente (porta 4173)
bun run lint         # ESLint
```

## Currículo (PDF)

A página `/cv` é renderizada como folha A4 e exportada em PDF estático.

```bash
bun run cv:build     # regera public/curriculo.pdf via headless Chrome
```

Quando atualizar dados em `src/data/`, rode esse comando antes de commitar
para o PDF refletir as mudanças.

## Estrutura de dados

Single source of truth em `src/data/`. Editar aqui propaga para o portfolio
e para o CV automaticamente:

| Arquivo | Conteúdo |
|---|---|
| `experience.ts` | Histórico profissional (4 cargos) |
| `projects.ts` | Projetos selecionados (Emittly, SecureVault, etc) |
| `clients.ts` | Clientes (Cacttus, FG, Agrotippo) |
| `technologies.ts` | Stack técnica (5 categorias × 23 techs) |
| `certifications.ts` | Certificações HackerRank |

---

## Deploy no GitHub Pages

### Setup inicial (uma vez só)

1. **Criar repositório no GitHub** com nome **exato** `rafaelnassar.github.io`
   (User Page — sem isso a URL fica `/portfolio/` em vez da raiz).

2. **Inicializar git e fazer primeiro push:**
   ```bash
   git init
   git branch -M main
   git remote add origin https://github.com/rafaelnassar/rafaelnassar.github.io.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

3. **Habilitar GitHub Actions como source de Pages:**
   - GitHub → Settings → Pages
   - Em "Build and deployment" → Source: **"GitHub Actions"**

4. **Aguardar primeiro deploy automático** (~2 min).

5. Site disponível em: **https://rafaelnassar.github.io**

### Deploys subsequentes

Qualquer `git push origin main` dispara o workflow `.github/workflows/deploy.yml`
automaticamente. O site é atualizado em ~1 min.

### Workflow de atualizar conteúdo

```bash
# 1. Editar dados
vim src/data/experience.ts

# 2. (Opcional) Regerar PDF se mudou algo do CV
bun run cv:build

# 3. Commitar e push
git add .
git commit -m "Atualiza experiência atual"
git push
```

GitHub Actions cuida do resto.

---

## Stack do projeto

- React 18 + Vite + TypeScript (strict)
- Tailwind CSS 3 + shadcn/ui (Radix primitives)
- Framer Motion 12 (entrada de seções, transições)
- Embla Carousel (Clientes)
- Lucide React (ícones)
- React Router DOM (SPA com fallback `404.html` para Pages)

## Arquitetura

- **Componentes shared** (`src/components/shared/`) com helpers (`cardClassName`,
  `iconButtonClassName`) para evitar duplicação de classes Tailwind.
- **Tema** light/dark via CSS variables HSL — toggle com `<ThemeToggle>`,
  persistência em `localStorage`, transição suave de 350ms.
- **Acessibilidade**: skip-link, focus-rings consistentes, mobile menu com
  focus trap + ESC, `prefers-reduced-motion` respeitado, touch targets ≥ 44px.
- **Página `/cv`**: força light mode + cores fixas → PDF gerado por
  `scripts/build-cv.mjs` (headless Chrome) sempre tem fundo branco
  independente do tema do site.
