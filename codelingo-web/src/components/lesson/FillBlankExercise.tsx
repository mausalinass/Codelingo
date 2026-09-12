import React, { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import type { LanguageId } from "../../types/api";

interface FillBlankExerciseProps {
  prompt: string;
  blankValue: string;
  onChange: (value: string) => void;
  language: LanguageId;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export const FillBlankExercise: React.FC<FillBlankExerciseProps> = ({
  prompt,
  blankValue,
  onChange,
  language,
  placeholder = "age >= 18",
  disabled = false,
  hasError = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const renderInput = () => (
    <input
      ref={inputRef}
      type="text"
      value={blankValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="bg-slate-800 text-amber-300 px-3 py-1 rounded-lg border-2 border-dashed border-red-400 focus:border-solid focus:border-red-500 focus:bg-slate-950 font-mono font-bold text-sm sm:text-base outline-hidden min-w-[140px] max-w-[240px] transition-all"
      autoComplete="off"
      spellCheck="false"
    />
  );

  const renderLanguageSnippet = () => {
    switch (language) {
      case "rust":
        return (
          <div>
            <div>
              <span className="text-purple-400">let</span> age:{" "}
              <span className="text-blue-400">i32</span> ={" "}
              <span className="text-amber-300">20</span>;
            </div>
            <div className="flex items-center flex-wrap gap-2 my-1">
              <span className="text-purple-400">if</span> {renderInput()} &#123;
            </div>
            <div className="pl-6">
              <span className="text-cyan-300">println!</span>(
              <span className="text-emerald-300">"Adult"</span>);
            </div>
            <div>&#125;</div>
          </div>
        );

      case "go":
        return (
          <div>
            <div>
              age := <span className="text-amber-300">20</span>
            </div>
            <div className="flex items-center flex-wrap gap-2 my-1">
              <span className="text-purple-400">if</span> {renderInput()} &#123;
            </div>
            <div className="pl-6">
              <span className="text-cyan-300">fmt</span>.Println(
              <span className="text-emerald-300">"Adult"</span>)
            </div>
            <div>&#125;</div>
          </div>
        );

      case "cpp":
        return (
          <div>
            <div>
              <span className="text-blue-400">int</span> age ={" "}
              <span className="text-amber-300">20</span>;
            </div>
            <div className="flex items-center flex-wrap gap-2 my-1">
              <span className="text-purple-400">if</span> ({renderInput()}) &#123;
            </div>
            <div className="pl-6">
              <span className="text-cyan-300">std::cout</span> &lt;&lt;{" "}
              <span className="text-emerald-300">"Adult"</span> &lt;&lt;{" "}
              <span className="text-cyan-300">std::endl</span>;
            </div>
            <div>&#125;</div>
          </div>
        );

      case "java":
        return (
          <div>
            <div>
              <span className="text-blue-400">int</span> age ={" "}
              <span className="text-amber-300">20</span>;
            </div>
            <div className="flex items-center flex-wrap gap-2 my-1">
              <span className="text-purple-400">if</span> ({renderInput()}) &#123;
            </div>
            <div className="pl-6">
              <span className="text-cyan-300">System.out</span>.println(
              <span className="text-emerald-300">"Adult"</span>);
            </div>
            <div>&#125;</div>
          </div>
        );

      case "typescript":
        return (
          <div>
            <div>
              <span className="text-blue-400">const</span> age:{" "}
              <span className="text-blue-300">number</span> ={" "}
              <span className="text-amber-300">20</span>;
            </div>
            <div className="flex items-center flex-wrap gap-2 my-1">
              <span className="text-purple-400">if</span> ({renderInput()}) &#123;
            </div>
            <div className="pl-6">
              <span className="text-cyan-300">console</span>.log(
              <span className="text-emerald-300">"Adult"</span>);
            </div>
            <div>&#125;</div>
          </div>
        );

      case "python":
        return (
          <div>
            <div>
              age = <span className="text-amber-300">20</span>
            </div>
            <div className="flex items-center flex-wrap gap-2 my-1">
              <span className="text-purple-400">if</span> {renderInput()}:
            </div>
            <div className="pl-6">
              print(<span className="text-emerald-300">"Adult"</span>)
            </div>
          </div>
        );

      case "csharp":
      default:
        return (
          <div>
            <div>
              <span className="text-blue-400">int</span> age ={" "}
              <span className="text-amber-300">20</span>;
            </div>
            <div className="flex items-center flex-wrap gap-2 my-1">
              <span className="text-purple-400">if</span> ({renderInput()}) &#123;
            </div>
            <div className="pl-6">
              <span className="text-cyan-300">Console</span>.WriteLine(
              <span className="text-emerald-300">"Adult"</span>);
            </div>
            <div>&#125;</div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Exercise Prompt */}
      <div className="flex items-center justify-between">
        <div className="font-extrabold text-slate-800 text-base sm:text-lg">
          {prompt}
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <Sparkles className="w-3 h-3" /> Quick fill
        </span>
      </div>

      {/* Preformatted Code Card with Embedded Input */}
      <div
        className={`rounded-2xl border bg-slate-900 text-slate-100 p-5 sm:p-6 font-mono text-sm sm:text-base leading-loose shadow-md transition-all ${
          hasError
            ? "border-rose-500 ring-2 ring-rose-500/40 animate-shake"
            : "border-slate-700 focus-within:ring-2 focus-within:ring-red-500/50"
        }`}
      >
        <div className="text-slate-400 select-none text-xs mb-3 font-sans uppercase font-bold tracking-wider">
          Complete the code expression:
        </div>

        {renderLanguageSnippet()}
      </div>
    </div>
  );
};
