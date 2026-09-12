import React from "react";
import { X } from "lucide-react";
interface Props { isOpen: boolean; onClose: () => void; }
export const CreateAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="demo-profile-title" className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-white" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between"><h2 id="demo-profile-title" className="font-bold text-lg">Demo profile</h2><button onClick={onClose} aria-label="Close demo profile"><X /></button></div>
      <p className="mt-4">You are using Mauricio's shared demonstration profile. Lessons, XP and progress are saved on the server for this demo user.</p>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Personal accounts and sign-in are not available yet. This demo does not collect email addresses or passwords.</p>
      <button onClick={onClose} className="mt-5 rounded-xl bg-red-600 text-white font-bold px-4 py-2">Continue learning</button>
    </section>
  </div>;
};
