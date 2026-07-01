import { SurveyForm } from "@/features/survey/components/SurveyForm";
import { createEdgeFunctionSurveySubmission } from "@/features/survey/adapters/edgeFunctionSurveySubmission";

const surveySubmission = createEdgeFunctionSurveySubmission();

const SurveyRoute = () => (
  <main className="min-h-screen bg-background px-4 py-12">
    <SurveyForm submission={surveySubmission} />
  </main>
);

export default SurveyRoute;
