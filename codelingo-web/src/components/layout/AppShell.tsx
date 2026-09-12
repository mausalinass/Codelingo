import React from "react";
import { TopNavigation } from "../navigation/TopNavigation";
import { LeftNavigationSidebar } from "../navigation/LeftNavigationSidebar";
import type { DashboardResponse, LanguageId } from "../../types/api";

interface AppShellProps {
  children: React.ReactNode;
  dashboard?: DashboardResponse;
  currentLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
  streakIncreased?: boolean;
  xpAwarded?: boolean;
  hideTopNav?: boolean;
  hideLeftNav?: boolean;
  maxWidth?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  dashboard,
  currentLanguage,
  onSelectLanguage,
  streakIncreased,
  xpAwarded,
  hideTopNav = false,
  hideLeftNav = false,
  maxWidth = "max-w-6xl xl:max-w-7xl",
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased selection:bg-red-500 selection:text-white transition-colors">
      {!hideLeftNav && (
        <LeftNavigationSidebar
          currentLanguage={currentLanguage}
          onSelectLanguage={onSelectLanguage}
          dashboard={dashboard}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {!hideTopNav && (
          <TopNavigation
            dashboard={dashboard}
            currentLanguage={currentLanguage}
            onSelectLanguage={onSelectLanguage}
            streakIncreased={streakIncreased}
            xpAwarded={xpAwarded}
          />
        )}
        <main className={`flex-1 w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col`}>
          {children}
        </main>
      </div>
    </div>
  );
};

