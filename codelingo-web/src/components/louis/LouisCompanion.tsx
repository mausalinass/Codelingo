export function LouisRoamer({ subtle = false }: { subtle?: boolean }) {
  return (
    <div className={`louis-roamer pointer-events-none fixed left-0 top-0 z-20 ${subtle ? "opacity-70" : "opacity-100"}`} aria-hidden="true">
      <img src="/louis-transparent.png" alt="" className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-lg" />
    </div>
  );
}

export function LouisConnectionStatus() {
  return (
    <aside className="fixed bottom-4 right-4 z-30 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95" aria-label="Louis connected">
      <img src="/louis-transparent.png" alt="Louis" className="h-11 w-11 object-contain" />
      <div className="pr-2">
        <p className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />Louis: connected</p>
        <p className="hidden text-[10px] font-semibold text-slate-500 sm:block">Your learning companion is active</p>
      </div>
    </aside>
  );
}
