import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/lib/i18n";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Rotas secundárias sob demanda — não inflam o bundle inicial do portfolio
const CV = lazy(() => import("./pages/CV"));
const Labs = lazy(() => import("./pages/Labs"));
const LabsScripts = lazy(() =>
  import("./pages/Labs").then((mod) => ({ default: mod.LabsScripts }))
);
const LabsDocs = lazy(() =>
  import("./pages/Labs").then((mod) => ({ default: mod.LabsDocs }))
);
const LabsApi = lazy(() =>
  import("./pages/LabsApi").then((mod) => ({ default: mod.LabsApi }))
);
const LabDetail = lazy(() => import("./pages/LabDetail"));
const ToolDetail = lazy(() => import("./pages/ToolDetail"));

const App = () => (
  <LanguageProvider>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/cv"
              element={
                <Suspense fallback={null}>
                  <CV />
                </Suspense>
              }
            />
            <Route path="/labs" element={<Navigate to="/labs/ferramentas" replace />} />
            <Route
              path="/labs/ferramentas"
              element={
                <Suspense fallback={null}>
                  <Labs />
                </Suspense>
              }
            />
            <Route
              path="/labs/ferramentas/gerador-de-cpf"
              element={<Navigate to="/labs/ferramentas/gerador-cpf-cnpj" replace />}
            />
            <Route
              path="/labs/ferramentas/gerador-de-cnpj"
              element={<Navigate to="/labs/ferramentas/gerador-cpf-cnpj" replace />}
            />
            <Route
              path="/labs/ferramentas/:slug"
              element={
                <Suspense fallback={null}>
                  <ToolDetail />
                </Suspense>
              }
            />
            <Route
              path="/labs/scripts"
              element={
                <Suspense fallback={null}>
                  <LabsScripts />
                </Suspense>
              }
            />
            <Route
              path="/labs/docs"
              element={
                <Suspense fallback={null}>
                  <LabsDocs />
                </Suspense>
              }
            />
            <Route
              path="/labs/api"
              element={
                <Suspense fallback={null}>
                  <LabsApi />
                </Suspense>
              }
            />
            <Route
              path="/labs/:slug"
              element={
                <Suspense fallback={null}>
                  <LabDetail />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </TooltipProvider>
  </LanguageProvider>
);

export default App;
