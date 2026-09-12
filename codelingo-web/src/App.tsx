import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LearnPage } from "./pages/LearnPage";
const LessonPage = lazy(() => import("./pages/LessonPage").then(m => ({ default: m.LessonPage })));
function LessonRoute() { const { language, lessonId } = useParams(); return <Suspense fallback={<p className="p-8">Loading lesson…</p>}><LessonPage key={language + "/" + lessonId} /></Suspense>; }
import { CompletePage } from "./pages/CompletePage";
import { PublicLandingPage } from "./pages/PublicLandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ExperienceStep, LanguageStep, PlacementResult, PlacementStep, TrackStep } from "./pages/OnboardingPages";
import { OnboardingProvider } from "./context/OnboardingContext";
import { DashboardInfoPage } from "./pages/DashboardInfoPages";
import type { LanguageId } from "./types/api";

export function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>(() => (localStorage.getItem("codelingo_active_language") as LanguageId) || "csharp");
  const selectLanguage = (language: LanguageId) => { localStorage.setItem("codelingo_active_language", language); setSelectedLanguage(language); };

  return (
    <ThemeProvider>
      <OnboardingProvider><BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/onboarding/language" element={<LanguageStep />} />
          <Route path="/onboarding/track" element={<TrackStep />} />
          <Route path="/onboarding/experience" element={<ExperienceStep />} />
          <Route path="/onboarding/placement" element={<PlacementStep />} />
          <Route path="/onboarding/result" element={<PlacementResult />} />
          <Route
            path="/learn"
            element={
              <LearnPage
                selectedLanguage={selectedLanguage}
                onSelectLanguage={selectLanguage}
              />
            }
          />
          <Route path="/lesson/:language/:lessonId" element={<LessonRoute />} />
          <Route path="/complete" element={<CompletePage />} />
          <Route path="/progress" element={<DashboardInfoPage kind="progress" selectedLanguage={selectedLanguage} onSelectLanguage={selectLanguage} />} />
          <Route path="/achievements" element={<DashboardInfoPage kind="achievements" selectedLanguage={selectedLanguage} onSelectLanguage={selectLanguage} />} />
          <Route path="/profile" element={<DashboardInfoPage kind="profile" selectedLanguage={selectedLanguage} onSelectLanguage={selectLanguage} />} />
        </Routes>
      </BrowserRouter></OnboardingProvider>
    </ThemeProvider>
  );
}

export default App;

