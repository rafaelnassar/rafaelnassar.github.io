import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/lib/i18n";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Rotas secundárias sob demanda — não inflam o bundle inicial do portfolio
const CV = lazy(() => import("./pages/CV"));
const Labs = lazy(() => import("./pages/Labs"));
const LabDetail = lazy(() => import("./pages/LabDetail"));

const App = () => (
  <LanguageProvider>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
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
            <Route
              path="/labs"
              element={
                <Suspense fallback={null}>
                  <Labs />
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
