import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Lighthouse from "./pages/Lighthouse";
import Assessment from "./pages/Assessment";
import AdminAssessment from "./pages/AdminAssessment";
import { SurveyForm } from "./features/survey/components/SurveyForm";
import NotFound from "./pages/NotFound";

const survey = (
  <main className="min-h-screen bg-background px-4 py-12">
    <SurveyForm onSubmit={() => undefined} />
  </main>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lighthouse" element={<Lighthouse />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/admin/assessment" element={<AdminAssessment />} />
            <Route path="/survey" element={survey} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
