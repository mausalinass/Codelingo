import React from "react";
import { TopNavigation } from "../navigation/TopNavigation";
import type { DashboardResponse, LanguageId } from "../../types/api";

interface AppShellProps {
  children: React.ReactNode;
  dashboard?: DashboardResponse;
  currentLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
  streakIncreased?: boolean;
  xpAwarded?: boolean;
  hideTopNav?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  dashboard,
  currentLanguage,
  onSelectLanguage,
  streakIncreased,
  xpAwarded,
  hideTopNav = false,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-red-500 selection:text-white">
      {!hideTopNav && (
        <TopNavigation
          dashboard={dashboard}
          currentLanguage={currentLanguage}
          onSelectLanguage={onSelectLanguage}
          streakIncreased={streakIncreased}
          xpAwarded={xpAwarded}
        />
      )}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {children}
      </main>
    </div>
  );
};
