import { useQuery } from "@tanstack/react-query";
import { AppShell } from "../components/layout/AppShell";
import { fetchDashboard } from "../api/dashboard";
import { DEMO_USER_ID, SUPPORTED_LANGUAGES } from "../lib/constants";
import type { LanguageId } from "../types/api";

interface Props { selectedLanguage: LanguageId; onSelectLanguage: (language: LanguageId) => void }
export function DashboardInfoPage({ kind, selectedLanguage, onSelectLanguage }: Props & { kind: "progress" | "achievements" | "profile" }) {
  const { data: dashboard, error, refetch } = useQuery({ queryKey: ["dashboard", DEMO_USER_ID], queryFn: () => fetchDashboard(DEMO_USER_ID) });
  const course = dashboard?.courses.find((item) => item.language === selectedLanguage);
  return <AppShell dashboard={dashboard} currentLanguage={selectedLanguage} onSelectLanguage={onSelectLanguage}>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">Could not load this page. <button onClick={()=>void refetch()} className="underline">Retry</button></p>}
    {kind === "progress" && <section><h1 className="text-4xl font-black">Progress</h1><p className="mt-2 text-slate-500">Your saved learning record.</p><div className="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7"><p className="text-sm font-black uppercase text-red-600">{SUPPORTED_LANGUAGES[selectedLanguage].label}</p><p className="text-5xl font-black mt-3">{course?.percentage ?? 0}%</p><p className="mt-2 text-slate-500">{course?.completedLessons ?? 0} of {course?.totalLessons ?? 0} lessons completed</p><div className="h-4 mt-6 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-red-600" style={{width:`${course?.percentage ?? 0}%`}} /></div></div></section>}
    {kind === "achievements" && <section><h1 className="text-4xl font-black">Achievements</h1><p className="mt-2 text-slate-500">Milestones earned from authoritative progress.</p><div className="mt-8 grid sm:grid-cols-2 gap-4">{[{name:"First Steps",ok:(course?.completedLessons??0)>=1},{name:"Flame Keeper",ok:(dashboard?.streak.longest??0)>=4},{name:"Centurion XP",ok:(dashboard?.user.totalXp??0)>=100}].map(x=><article key={x.name} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"><span className={`inline-block w-3 h-3 rounded-full ${x.ok?"bg-emerald-500":"bg-slate-300"}`}/><h2 className="font-black text-xl mt-3">{x.name}</h2><p className="text-slate-500 mt-1">{x.ok?"Earned":"Keep learning to unlock"}</p></article>)}</div></section>}
    {kind === "profile" && <section><h1 className="text-4xl font-black">Profile</h1><div className="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7"><div className="w-20 h-20 rounded-full bg-red-600 text-white grid place-items-center text-3xl font-black">{dashboard?.user.displayName?.[0] ?? "M"}</div><h2 className="text-2xl font-black mt-4">{dashboard?.user.displayName ?? "Demo learner"}</h2><p className="text-slate-500 mt-1">Hackathon demo profile · {dashboard?.user.totalXp ?? 0} XP</p><button onClick={()=>{localStorage.removeItem("codelingo_demo_session");window.location.assign('/')}} className="mt-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-3 font-black">Exit demo session</button></div></section>}
  </AppShell>;
}
