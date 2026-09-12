import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LearnPage } from "./pages/LearnPage";
import { LessonPage } from "./pages/LessonPage";
import { CompletePage } from "./pages/CompletePage";
import type { LanguageId } from "./types/api";

export function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>("csharp");

  return (
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
        <Route path="/lesson/:language/:lessonId" element={<LessonPage />} />
        <Route path="/complete" element={<CompletePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
