import React from "react";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

interface ConceptCardProps {
  title: string;
  explanation: string | null;
  visualSteps?: string[];
  isVisualMode?: boolean;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  title,
  explanation,
  visualSteps,
  isVisualMode = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
          <BookOpen className="w-4 h-4 stroke-[2.5]" />
        </div>
        <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
          {title}
        </h3>
      </div>

      {/* Explanation Text */}
      {explanation && (
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
          {explanation}
        </p>
      )}

      {/* Visual Flow or Step-by-Step Logic Breakdown */}
      {visualSteps && visualSteps.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            {isVisualMode ? "Logic Flowchart" : "Execution Breakdown"}
          </div>

          {isVisualMode ? (
            // Visual flowchart nodes with arrow connectors
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 py-2">
              {visualSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="w-full sm:w-auto flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-semibold text-slate-800 text-center shadow-2xs">
                    {step}
                  </div>
                  {idx < visualSteps.length - 1 && (
                    <div className="text-slate-400 rotate-90 sm:rotate-0 my-1 sm:my-0">
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            // Technical bullet list
            <div className="space-y-1.5">
              {visualSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
