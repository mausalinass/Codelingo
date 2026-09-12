import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LearnPage } from "./pages/LearnPage";
const LessonPage = lazy(() => import("./pages/LessonPage").then(m => ({ default: m.LessonPage })));
function LessonRoute() { const { language, lessonId } = useParams(); return <Suspense fallback={<p className="p-8">Loading lesson…</p>}><LessonPage key={language + "/" + lessonId} /></Suspense>; }
import { CompletePage } from "./pages/CompletePage";
import type { LanguageId } from "./types/api";

export function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>("csharp");

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/learn" replace />} />
          <Route
            path="/learn"
            element={
              <LearnPage
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
              />
            }
          />
          <Route path="/lesson/:language/:lessonId" element={<LessonRoute />} />
          <Route path="/complete" element={<CompletePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

