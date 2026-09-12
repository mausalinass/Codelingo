import React from "react";
import { LessonNode } from "./LessonNode";
import type { LanguageId, LessonStatus } from "../../types/api";
import type { PathLessonNode } from "../../types/lesson";

interface LearningPathProps {
  language: LanguageId;
  completedLessons?: string[];
}

import { LESSON_TEMPLATES } from "../../lib/constants";

const OFFSETS = [
  "translate-x-0",
  "translate-x-12",
  "translate-x-4",
  "-translate-x-10",
  "translate-x-0",
  "translate-x-12",
  "-translate-x-4",
  "-translate-x-12",
];

export const LearningPath: React.FC<LearningPathProps> = ({
  language,
  completedLessons = ["hello"],
}) => {
  // Determine first incomplete lesson index to set as current
  const firstIncompleteIdx = LESSON_TEMPLATES.findIndex(
    (tmpl) => !completedLessons.includes(tmpl.id)
  );

  const pathNodes: PathLessonNode[] = LESSON_TEMPLATES.map((tmpl, idx) => {
    const isCompleted = completedLessons.includes(tmpl.id);
    let status: LessonStatus = "locked";

    if (isCompleted) {
      status = "completed";
    } else if (idx === firstIncompleteIdx) {
      status = "current";
    } else {
      status = "locked";
    }

    return {
      id: tmpl.id,
      title: tmpl.title,
      description: tmpl.description,
      language,
      order: idx + 1,
      status,
    };
  });

  return (
    <div className="relative py-8 flex flex-col items-center">
      {/* Decorative vertical connector guideline */}
      <div className="absolute top-12 bottom-12 w-2 bg-slate-200 rounded-full z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-12 w-full">
        {pathNodes.map((node, i) => (
          <div key={node.id} className="relative flex justify-center w-full">
            <LessonNode
              lesson={node}
              offsetClass={OFFSETS[i % OFFSETS.length]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
