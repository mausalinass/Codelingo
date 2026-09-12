import { Link } from "react-router-dom";
import { useState } from "react";
import { ThemeToggle } from "../components/navigation/ThemeToggle";
import { useOnboarding, type UiLanguage } from "../context/OnboardingContext";

export function PublicLandingPage() {
  const { state: onboarding, update: updateOnboarding } = useOnboarding();
  const [greeting, setGreeting] = useState("Click Louis and let's code together!");
  const hasDemoSession = localStorage.getItem("codelingo_demo_session") === "true";
  return <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-950 dark:text-white flex flex-col transition-colors">
    <header className="max-w-6xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
      <Link to="/" className="flex items-center gap-3"><img src="/logo.png" className="w-12 h-12 rounded-2xl" alt="Codelingo"/><span className="text-2xl font-black">Code<span className="text-red-600">lingo</span></span></Link>
      <div className="flex items-center gap-3"><label className="sr-only" htmlFor="site-language">Site language</label><select id="site-language" value={onboarding.uiLanguage ?? "es"} onChange={(event) => updateOnboarding({ uiLanguage: event.target.value as UiLanguage })} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 font-bold"><option value="es">🇪🇸 Español</option><option value="en">🇺🇸 English</option></select><ThemeToggle /></div>
    </header>
    <main className="flex-1 max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
      <button onClick={() => setGreeting(greeting.startsWith("Click") ? "Small steps. Big developers. Ready?" : "Click Louis and let's code together!")} className="relative min-h-80 group" aria-label="Talk to Louis">
        <span className="absolute right-4 top-2 max-w-64 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 font-bold">{greeting}</span>
        <img src="/louis-transparent.png" className="w-72 h-72 object-contain mx-auto transition group-hover:-translate-y-2 group-focus:-translate-y-2 motion-reduce:transform-none motion-reduce:transition-none" alt="Louis, the interactive red cardinal" />
        <span className="absolute left-8 top-12 text-5xl font-black text-slate-800 dark:text-slate-200">&lt;/&gt;</span><span className="absolute right-10 bottom-8 text-5xl font-black text-red-600">&#123; &#125;</span>
      </button>
      <section className="text-center lg:text-left"><h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">Learn to code.<br/><span className="text-red-600">One small step every day.</span></h1><p className="mt-5 text-lg text-slate-600 dark:text-slate-300">Practical lessons that adapt to how you learn, with Louis by your side.</p><div className="mt-9 space-y-4 max-w-xl">{hasDemoSession?<><Link to="/learn" className="block rounded-2xl border-b-4 border-red-800 bg-red-600 px-6 py-4 text-center font-black text-white hover:bg-red-700">CONTINUE LEARNING</Link><Link to="/onboarding/language" className="block text-center text-sm font-bold text-slate-500 underline">Start a new placement test</Link></>:<><Link to="/onboarding/language" className="block rounded-2xl border-b-4 border-red-800 bg-red-600 px-6 py-4 text-center font-black text-white hover:bg-red-700">GET STARTED</Link><Link to="/login" className="block rounded-2xl border-2 border-slate-200 dark:border-slate-700 px-6 py-4 text-center font-black text-red-600 hover:bg-slate-50 dark:hover:bg-slate-900">I ALREADY HAVE AN ACCOUNT</Link><Link to="/learn" onClick={()=>localStorage.setItem("codelingo_demo_session","true")} className="block text-center text-sm font-bold text-slate-500 underline">Try the hackathon demo</Link></>}</div></section>
    </main>
  </div>;
}
