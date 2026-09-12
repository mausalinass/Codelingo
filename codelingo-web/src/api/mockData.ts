import type {
  AdaptiveLessonResponse,
  DashboardResponse,
  EvaluateRequest,
  EvaluateResponse,
  LanguageId,
  PersonalityResponse,
  PersonalityTrait,
} from "../types/api";
import { DEMO_USER_ID } from "../lib/constants";

// Global mutable mock state for seamless offline fallback / demo consistency
export interface MockState {
  totalXp: number;
  streakCurrent: number;
  streakLongest: number;
  activeLanguage: LanguageId;
  personality: PersonalityTrait;
  completedLessons: Record<LanguageId, string[]>;
}

export const mockState: MockState = {
  totalXp: 120,
  streakCurrent: 4,
  streakLongest: 7,
  activeLanguage: "csharp",
  personality: "ANALYTICAL",
  completedLessons: {
    csharp: ["hello"],
    javascript: [],
    python: [],
  },
};

export function getMockDashboard(): DashboardResponse {
  const getCompletedCount = (lang: LanguageId) => mockState.completedLessons[lang]?.length || 0;
  return {
    user: {
      id: DEMO_USER_ID,
      displayName: "Alex",
      totalXp: mockState.totalXp,
    },
    streak: {
      current: mockState.streakCurrent,
      longest: mockState.streakLongest,
    },
    activeLanguage: mockState.activeLanguage,
    courses: [
      {
        language: "csharp",
        completedLessons: getCompletedCount("csharp"),
        totalLessons: 3,
        percentage: Math.round((getCompletedCount("csharp") / 3) * 100),
      },
      {
        language: "javascript",
        completedLessons: getCompletedCount("javascript"),
        totalLessons: 3,
        percentage: Math.round((getCompletedCount("javascript") / 3) * 100),
      },
      {
        language: "python",
        completedLessons: getCompletedCount("python"),
        totalLessons: 3,
        percentage: Math.round((getCompletedCount("python") / 3) * 100),
      },
    ],
  };
}

export function getMockPersonality(): PersonalityResponse {
  const trait = mockState.personality;
  if (trait === "ANALYTICAL") {
    return {
      source: "SWELL",
      primaryTrait: "ANALYTICAL",
      learningMode: "DEEP_EXPLANATION",
      scores: { analytical: 88, practical: 42, visual: 60 },
    };
  } else if (trait === "PRACTICAL") {
    return {
      source: "SWELL",
      primaryTrait: "PRACTICAL",
      learningMode: "PRACTICE_FIRST",
      scores: { analytical: 45, practical: 92, visual: 58 },
    };
  } else {
    return {
      source: "SWELL",
      primaryTrait: "VISUAL",
      learningMode: "VISUAL_GUIDED",
      scores: { analytical: 50, practical: 52, visual: 94 },
    };
  }
}

export function getMockAdaptiveLesson(
  language: LanguageId,
  lessonId: string,
  traitOverride?: PersonalityTrait
): AdaptiveLessonResponse {
  const trait = traitOverride || mockState.personality;

  if (language === "csharp" && lessonId === "conditions") {
    if (trait === "ANALYTICAL") {
      return {
        lessonId: "conditions",
        language: "csharp",
        personality: "ANALYTICAL",
        presentationMode: "DEEP_EXPLANATION",
        title: "Conditional Statements & Boolean Logic",
        louisMessage: "Notice how conditions direct code flow based on boolean expressions. Let's analyze the mechanics first.",
        explanation:
          "In C#, an `if` statement evaluates a conditional boolean expression before choosing a code branch. If the operand evaluates to `true`, the enclosed block runs. The comparison operator `>=` checks if the left operand is greater than or equal to the right operand.",
        visualSteps: [
          "1. Evaluate condition: (age >= 18)",
          "2. If condition is true: enter block body",
          "3. Output message to Console",
        ],
        showExplanationFirst: true,
        exercise: {
          id: "cs-if-01",
          type: "CODE",
          prompt: "Write a condition that prints 'Adult' if age is greater than or equal to 18.",
          starterCode: `int age = 20;\nif (age >= 18) {\n    Console.WriteLine("Adult");\n}`,
          placeholder: "age >= 18",
        },
      };
    } else if (trait === "PRACTICAL") {
      return {
        lessonId: "conditions",
        language: "csharp",
        personality: "PRACTICAL",
        presentationMode: "PRACTICE_FIRST",
        title: "Hands-on If Condition",
        louisMessage: "You learn by doing. Let's jump in.",
        explanation: null,
        showExplanationFirst: false,
        exercise: {
          id: "cs-if-01",
          type: "FILL_BLANK",
          prompt: "Fill in the missing condition so the code outputs 'Adult' when age is 18 or older.",
          starterCode: `int age = 20;\nif ( [blank] ) {\n    Console.WriteLine("Adult");\n}`,
          placeholder: "age >= 18",
        },
      };
    } else {
      return {
        lessonId: "conditions",
        language: "csharp",
        personality: "VISUAL",
        presentationMode: "VISUAL_GUIDED",
        title: "Visual Flow: Condition Branching",
        louisMessage: "Follow the visual diagram flow below! Complete the comparison block to open the gate.",
        explanation: "Check the flowchart diagram. When age >= 18, control branches to the Adult output node.",
        visualSteps: [
          "Input: age = 20",
          "Decision Gate: [ age >= 18 ]",
          "Branch: TRUE → Console.WriteLine('Adult')",
        ],
        showExplanationFirst: false,
        exercise: {
          id: "cs-if-01",
          type: "FILL_BLANK",
          prompt: "Fill in the comparison that lets the flow pass to 'Adult'.",
          starterCode: `int age = 20;\nif ( [blank] ) {\n    Console.WriteLine("Adult");\n}`,
          placeholder: "age >= 18",
        },
      };
    }
  }

  // Fallback / default lessons for other routes
  return {
    lessonId,
    language,
    personality: trait,
    presentationMode:
      trait === "ANALYTICAL"
        ? "DEEP_EXPLANATION"
        : trait === "PRACTICAL"
        ? "PRACTICE_FIRST"
        : "VISUAL_GUIDED",
    title: `${language.toUpperCase()} - ${lessonId.toUpperCase()}`,
    louisMessage:
      trait === "ANALYTICAL"
        ? "Deep dive into language syntax and architectural patterns."
        : trait === "PRACTICAL"
        ? "You learn by doing. Let's jump in."
        : "Visual breakdown of core language logic.",
    explanation:
      trait === "ANALYTICAL"
        ? `In ${language}, this concept forms the bedrock of control flow.`
        : null,
    showExplanationFirst: trait === "ANALYTICAL",
    exercise: {
      id: `${language}-${lessonId}-01`,
      type: trait === "ANALYTICAL" ? "CODE" : "FILL_BLANK",
      prompt: `Complete the ${lessonId} exercise for ${language}.`,
      starterCode:
        language === "python"
          ? `age = 20\nif age >= 18:\n    print("Adult")`
          : `const age = 20;\nif (age >= 18) {\n    console.log("Adult");\n}`,
      placeholder: "age >= 18",
    },
  };
}

export function evaluateMockExercise(req: EvaluateRequest): EvaluateResponse {
  const cleanAns = req.answer.replace(/\s+/g, " ").trim();
  const isCorrect =
    cleanAns.includes("age >= 18") ||
    cleanAns.includes("age>=18") ||
    cleanAns === "age >= 18" ||
    cleanAns.includes("if (age >= 18)") ||
    cleanAns.includes("if(age>=18)") ||
    cleanAns.includes("if ( age >= 18 )");

  if (isCorrect) {
    const prevStreak = mockState.streakCurrent;
    mockState.totalXp += 10;
    mockState.streakCurrent += 1;
    mockState.streakLongest = Math.max(mockState.streakLongest, mockState.streakCurrent);

    if (!mockState.completedLessons[req.language].includes(req.lessonId)) {
      mockState.completedLessons[req.language].push(req.lessonId);
    }

    const completedCount = mockState.completedLessons[req.language].length;

    return {
      correct: true,
      xpAwarded: 10,
      feedback: {
        title: "Outstanding! 🎉",
        message:
          "Spot on! In C#, condition checks strictly evaluate boolean expressions to branch execution safely.",
      },
      progress: {
        lessonCompleted: true,
        languagePercentage: Math.min(100, Math.round((completedCount / 3) * 100)),
      },
      streak: {
        previous: prevStreak,
        current: mockState.streakCurrent,
        increased: true,
      },
    };
  }

  return {
    correct: false,
    xpAwarded: 0,
    feedback: {
      title: "Not quite yet 💡",
      message:
        "Check your comparison operator. We want to check if `age` is greater than or equal to 18 (`age >= 18`).",
    },
    progress: {
      lessonCompleted: false,
      languagePercentage: Math.round(
        (mockState.completedLessons[req.language].length / 3) * 100
      ),
    },
    streak: {
      previous: mockState.streakCurrent,
      current: mockState.streakCurrent,
      increased: false,
    },
  };
}
