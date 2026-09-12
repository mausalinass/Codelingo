import React from "react";
import { useTheme } from "../../context/useTheme";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import type { LanguageId } from "../../types/api";

interface CodeExerciseProps {
  prompt: string;
  code: string;
  onChange: (value: string) => void;
  language: LanguageId;
  disabled?: boolean;
}

export const CodeExercise: React.FC<CodeExerciseProps> = ({
  prompt,
  code,
  onChange,
  language,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const getExtensions = () => {
    switch (language) {
      case "python":
        return [python()];
      case "javascript": return [javascript()];
      case "typescript": return [javascript({ typescript: true })];
      default: return [];
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Exercise Prompt */}
      <div className="font-extrabold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
        {prompt}
      </div>

      {/* Code Editor Container */}
      <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-900 overflow-hidden shadow-md focus-within:ring-2 focus-within:ring-red-500/50 transition-all">
        {/* Editor Fake Window Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60 select-none">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400">
            solution.{
              language === "csharp"
                ? "cs"
                : language === "python"
                ? "py"
                : language === "rust"
                ? "rs"
                : language === "go"
                ? "go"
                : language === "cpp"
                ? "cpp"
                : language === "java"
                ? "java"
                : language === "javascript" ? "js" : "ts"
            }
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-500">
            CodeMirror
          </span>
        </div>

        {/* CodeMirror Surface */}
        <div className="p-1 font-mono text-sm">
          <CodeMirror
            value={code}
            height="180px"
            theme={theme}
            extensions={getExtensions()}
            onChange={onChange}
            readOnly={disabled}
            basicSetup={{
              lineNumbers: true,
              foldGutter: false,
              highlightActiveLine: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};
