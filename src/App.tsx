import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// Landing page and the tiny 404 stay eager for fast first paint.
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Heavier routes are code-split so they do not weigh down the homepage bundle.
const Lighthouse = lazy(() => import("./pages/Lighthouse"));
const AI = lazy(() => import("./pages/AI"));
const Assessment = lazy(() => import("./pages/Assessment"));
const AdminAssessment = lazy(() => import("./pages/AdminAssessment"));
const SurveyRoute = lazy(() => import("./pages/SurveyRoute"));
const SizingPoker = lazy(() => import("./pages/SizingPoker"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen bg-background" aria-hidden="true" />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/lighthouse" element={<Lighthouse />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/admin/dashboard" element={<AdminAssessment />} />
              <Route
                path="/admin/assessment"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="/survey" element={<SurveyRoute />} />
              <Route path="/sizing-poker" element={<SizingPoker />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
