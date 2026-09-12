import type {
  AdaptiveLessonResponse,
  DashboardResponse,
  EvaluateRequest,
  EvaluateResponse,
  LanguageId,
  PersonalityResponse,
  PersonalityTrait,
} from "../types/api";
import { DEMO_USER_ID, SUPPORTED_LANGUAGES } from "../lib/constants";

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
    typescript: [],
    python: [],
    rust: [],
    go: [],
    cpp: [],
    java: [],
  },
};

export const TOTAL_LESSONS_PER_COURSE = 10;

export function getMockDashboard(): DashboardResponse {
  const getCompletedCount = (lang: LanguageId) =>
    mockState.completedLessons[lang]?.length || 0;

  const languages = Object.keys(SUPPORTED_LANGUAGES) as LanguageId[];

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
    courses: languages.map((lang) => {
      const completed = getCompletedCount(lang);
      return {
        language: lang,
        completedLessons: completed,
        totalLessons: TOTAL_LESSONS_PER_COURSE,
        percentage: Math.min(100, Math.round((completed / TOTAL_LESSONS_PER_COURSE) * 100)),
      };
    }),
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

interface LectureDetail {
  title: string;
  topic: string;
  analyticalMsg: string;
  practicalMsg: string;
  visualMsg: string;
  analyticalExplanation: string;
  visualSteps: string[];
  placeholder: string;
  prompts: Record<string, string>;
  starters: Record<LanguageId, string>;
  correctKeyword: string;
}

const LECTURE_DATABASE: Record<string, LectureDetail> = {
  hello: {
    title: "Hello World & Output",
    topic: "Basic syntax & printing to stdout",
    analyticalMsg: "Notice the structural entry point and how standard output streams receive string literals.",
    practicalMsg: "You learn by doing. Print your first message to the console!",
    visualMsg: "Follow the output pipeline: String literal -> Standard Out -> Display terminal.",
    analyticalExplanation:
      "Every language defines an entry point and runtime binding to write UTF-8 characters to the standard output device.",
    visualSteps: [
      "1. Allocate String Literal 'Hello, World!'",
      "2. Invoke Output Stream Function",
      "3. Flush to Console Buffer",
    ],
    placeholder: "Hello, World!",
    prompts: {
      default: "Print 'Hello, World!' to the console.",
    },
    starters: {
      csharp: 'Console.WriteLine("Hello, World!");',
      javascript: 'console.log("Hello, World!");',
      typescript: 'console.log("Hello, World!");',
      python: 'print("Hello, World!")',
      rust: 'println!("Hello, World!");',
      go: 'fmt.Println("Hello, World!")',
      cpp: 'std::cout << "Hello, World!" << std::endl;',
      java: 'System.out.println("Hello, World!");',
    },
    correctKeyword: "Hello",
  },
  variables: {
    title: "Variables, Mutability & Types",
    topic: "Memory allocation, binding & type safety",
    analyticalMsg: "Let's examine how memory locations are bound to identifiers with type constraints.",
    practicalMsg: "Create a variable named 'score' holding the value 100.",
    visualMsg: "Picture a labeled memory container. The label is 'score' and its contents are 100.",
    analyticalExplanation:
      "Variables allocate stack space with specific byte representations and strict mutability guarantees.",
    visualSteps: [
      "1. Declare Identifier 'score'",
      "2. Determine Integer Type & Memory Size",
      "3. Assign Value 100",
    ],
    placeholder: "score = 100",
    prompts: {
      default: "Declare an integer variable named score initialized to 100.",
    },
    starters: {
      csharp: "int score = 100;",
      javascript: "let score = 100;",
      typescript: "let score: number = 100;",
      python: "score: int = 100",
      rust: "let score: i32 = 100;",
      go: "score := 100",
      cpp: "int score = 100;",
      java: "int score = 100;",
    },
    correctKeyword: "100",
  },
  conditions: {
    title: "Conditional Statements & Boolean Logic",
    topic: "If-statements & boolean branching",
    analyticalMsg: "Notice how conditions direct code flow based on boolean expressions. Let's analyze the mechanics first.",
    practicalMsg: "You learn by doing. Let's jump in.",
    visualMsg: "Follow the visual diagram flow! Complete the comparison block to open the gate.",
    analyticalExplanation:
      "An `if` statement evaluates a conditional boolean expression before choosing a code branch. Comparison operators like `>=` compare numeric expressions.",
    visualSteps: [
      "1. Evaluate condition: (age >= 18)",
      "2. If condition is true: enter block body",
      "3. Output message to Console",
    ],
    placeholder: "age >= 18",
    prompts: {
      default: "Write a condition that checks if age is greater than or equal to 18.",
    },
    starters: {
      csharp: 'int age = 20;\nif (age >= 18) {\n    Console.WriteLine("Adult");\n}',
      javascript: 'const age = 20;\nif (age >= 18) {\n    console.log("Adult");\n}',
      typescript: 'const age: number = 20;\nif (age >= 18) {\n    console.log("Adult");\n}',
      python: 'age = 20\nif age >= 18:\n    print("Adult")',
      rust: 'let age = 20;\nif age >= 18 {\n    println!("Adult");\n}',
      go: 'age := 20\nif age >= 18 {\n    fmt.Println("Adult")\n}',
      cpp: 'int age = 20;\nif (age >= 18) {\n    std::cout << "Adult" << std::endl;\n}',
      java: 'int age = 20;\nif (age >= 18) {\n    System.out.println("Adult");\n}',
    },
    correctKeyword: "18",
  },
  functions: {
    title: "Functions, Signatures & Returns",
    topic: "Callable subroutines, parameters & return values",
    analyticalMsg: "Analyze how functions create isolated execution frames and manage call stacks.",
    practicalMsg: "Define a function 'add' that takes two numbers and returns their sum.",
    visualMsg: "Visualize a transform block: two input wires (a, b) enter, and sum (a + b) leaves.",
    analyticalExplanation:
      "Functions accept parameters, allocate a stack frame, execute instructions, and return an evaluated result.",
    visualSteps: [
      "1. Push arguments (a, b) to Call Stack",
      "2. Execute addition operation: a + b",
      "3. Pop frame & Return value to caller",
    ],
    placeholder: "a + b",
    prompts: {
      default: "Complete the function to return the sum of a and b.",
    },
    starters: {
      csharp: "int Add(int a, int b) {\n    return a + b;\n}",
      javascript: "function add(a, b) {\n    return a + b;\n}",
      typescript: "function add(a: number, b: number): number {\n    return a + b;\n}",
      python: "def add(a: int, b: int) -> int:\n    return a + b",
      rust: "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}",
      go: "func add(a int, b int) int {\n    return a + b\n}",
      cpp: "int add(int a, int b) {\n    return a + b;\n}",
      java: "public static int add(int a, int b) {\n    return a + b;\n}",
    },
    correctKeyword: "a + b",
  },
  loops: {
    title: "Loops & Iterative Execution",
    topic: "Bounded & unbounded repetition",
    analyticalMsg: "Examine the loop invariants, step counter, and termination criteria.",
    practicalMsg: "Loop 5 times and print each index.",
    visualMsg: "Watch the circular conveyor belt loop until the counter reaches the limit.",
    analyticalExplanation:
      "Loops repeat a statement block until the conditional test fails, updating state on each iteration.",
    visualSteps: [
      "1. Initialize counter i = 0",
      "2. Check condition i < 5",
      "3. Execute body and increment i++",
    ],
    placeholder: "i < 5",
    prompts: {
      default: "Write the loop condition to iterate while i is less than 5.",
    },
    starters: {
      csharp: 'for (int i = 0; i < 5; i++) {\n    Console.WriteLine(i);\n}',
      javascript: 'for (let i = 0; i < 5; i++) {\n    console.log(i);\n}',
      typescript: 'for (let i: number = 0; i < 5; i++) {\n    console.log(i);\n}',
      python: 'for i in range(5):\n    print(i)',
      rust: 'for i in 0..5 {\n    println!("{}", i);\n}',
      go: 'for i := 0; i < 5; i++ {\n    fmt.Println(i)\n}',
      cpp: 'for (int i = 0; i < 5; ++i) {\n    std::cout << i << std::endl;\n}',
      java: 'for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}',
    },
    correctKeyword: "5",
  },
  arrays: {
    title: "Arrays, Slices & Collections",
    topic: "Contiguous memory layouts & indexing",
    analyticalMsg: "Understand pointer offsets and constant-time O(1) indexing in contiguous arrays.",
    practicalMsg: "Access the first element of the numbers collection.",
    visualMsg: "Picture a train of numbered compartments. Index [0] is the engine compartment.",
    analyticalExplanation:
      "Arrays store homogeneous items sequentially in memory, enabling direct offset calculations base + (index * size).",
    visualSteps: [
      "1. Base Pointer Address 0x1000",
      "2. Offset: Index * Item Size",
      "3. Dereference value in O(1) time",
    ],
    placeholder: "numbers[0]",
    prompts: {
      default: "Access the first element of the array using index 0.",
    },
    starters: {
      csharp: "int[] numbers = { 10, 20, 30 };\nint first = numbers[0];",
      javascript: "const numbers = [10, 20, 30];\nconst first = numbers[0];",
      typescript: "const numbers: number[] = [10, 20, 30];\nconst first = numbers[0];",
      python: "numbers = [10, 20, 30]\nfirst = numbers[0]",
      rust: "let numbers = [10, 20, 30];\nlet first = numbers[0];",
      go: "numbers := []int{10, 20, 30}\nfirst := numbers[0]",
      cpp: "int numbers[] = { 10, 20, 30 };\nint first = numbers[0];",
      java: "int[] numbers = { 10, 20, 30 };\nint first = numbers[0];",
    },
    correctKeyword: "0",
  },
  oop: {
    title: "Structs, Classes & Modeling",
    topic: "Encapsulation, fields & behavior",
    analyticalMsg: "Examine memory layout, method dispatch, and object encapsulation patterns.",
    practicalMsg: "Create an instance with name 'Louis' and level 1.",
    visualMsg: "Think of a blueprint (Class) stamping out real physical widgets (Instances).",
    analyticalExplanation:
      "Classes and structs bundle state and behaviors together, defining contracts for data modeling.",
    visualSteps: [
      "1. Class Blueprint Definition",
      "2. Heap Allocation / Struct Layout",
      "3. Initialize Member Fields",
    ],
    placeholder: "name: 'Louis'",
    prompts: {
      default: "Instantiate the object or struct with appropriate fields.",
    },
    starters: {
      csharp: 'public class Hero {\n    public string Name { get; set; } = "Louis";\n}',
      javascript: 'class Hero {\n    constructor() { this.name = "Louis"; }\n}',
      typescript: 'class Hero {\n    name: string = "Louis";\n}',
      python: 'class Hero:\n    def __init__(self):\n        self.name = "Louis"',
      rust: 'struct Hero {\n    name: String,\n}\nlet h = Hero { name: String::from("Louis") };',
      go: 'type Hero struct {\n    Name string\n}\nh := Hero{Name: "Louis"}',
      cpp: 'class Hero {\npublic:\n    std::string name = "Louis";\n};',
      java: 'public class Hero {\n    public String name = "Louis";\n}',
    },
    correctKeyword: "Louis",
  },
  async: {
    title: "Async & Concurrency",
    topic: "Non-blocking execution & futures",
    analyticalMsg: "Analyze event loops, cooperative multitasking, and asynchronous task scheduling.",
    practicalMsg: "Await the asynchronous operation to retrieve the result.",
    visualMsg: "Instead of waiting idle at the counter, you take a buzzer ticket and continue working!",
    analyticalExplanation:
      "Async operations yield thread execution back to the runtime until I/O or background computations complete.",
    visualSteps: [
      "1. Initiate Async Background Task",
      "2. Yield thread control to Event Loop",
      "3. Resume when Promise resolves",
    ],
    placeholder: "await task",
    prompts: {
      default: "Use the await keyword to non-blockingly retrieve the result.",
    },
    starters: {
      csharp: "async Task Run() {\n    await Task.Delay(100);\n}",
      javascript: "async function run() {\n    await Promise.resolve();\n}",
      typescript: "async function run(): Promise<void> {\n    await Promise.resolve();\n}",
      python: "async def run():\n    await asyncio.sleep(0.1)",
      rust: "async fn run() {\n    task.await;\n}",
      go: "go func() {\n    ch <- true\n}()",
      cpp: "std::future<int> fut = std::async(compute);",
      java: "CompletableFuture.supplyAsync(() -> 42);",
    },
    correctKeyword: "await",
  },
  errors: {
    title: "Error Handling & Recovery",
    topic: "Try/catch, Result types & panic recovery",
    analyticalMsg: "Examine how stack unwinding, exceptions, and algebraic Result types isolate failure states.",
    practicalMsg: "Handle the potential error gracefully using try/catch or pattern matching.",
    visualMsg: "Think of a safety net: if a function slips and drops an error, catch prevents the crash!",
    analyticalExplanation:
      "Modern languages handle exceptional execution paths via either exception unwinding or explicit monadic types (Result/Option).",
    visualSteps: [
      "1. Execute Protected Instruction Block",
      "2. Catch Raised Exception or Intercept Err",
      "3. Execute Recovery & Cleanup Handlers",
    ],
    placeholder: "catch (Exception ex)",
    prompts: {
      default: "Add the catch or error checking block to prevent an unhandled crash.",
    },
    starters: {
      csharp: 'try {\n    RiskyAction();\n} catch (Exception ex) {\n    Console.WriteLine(ex.Message);\n}',
      javascript: 'try {\n    riskyAction();\n} catch (err) {\n    console.error(err.message);\n}',
      typescript: 'try {\n    riskyAction();\n} catch (err: unknown) {\n    console.error(err);\n}',
      python: 'try:\n    risky_action()\nexcept Exception as e:\n    print(e)',
      rust: 'match risky_action() {\n    Ok(val) => println!("{}", val),\n    Err(e) => eprintln!("{}", e),\n}',
      go: 'if err != nil {\n    log.Fatal(err)\n}',
      cpp: 'try {\n    riskyAction();\n} catch (const std::exception& e) {\n    std::cerr << e.what();\n}',
      java: 'try {\n    riskyAction();\n} catch (Exception e) {\n    e.printStackTrace();\n}',
    },
    correctKeyword: "catch",
  },
  generics: {
    title: "Generics, Type Parameters & Traits",
    topic: "Monomorphization, type safety & parameterized reuse",
    analyticalMsg: "Analyze compile-time monomorphization and interface constraints on type parameters.",
    practicalMsg: "Define a generic container <T> that stores any type safely.",
    visualMsg: "Picture a modular plug adapter that fits any shape or type of cable seamlessly.",
    analyticalExplanation:
      "Generics enable code reuse with compile-time type checking, avoiding runtime casting overhead through specialized instantiation.",
    visualSteps: [
      "1. Declare Generic Parameter <T>",
      "2. Bind Concrete Type at Call Site",
      "3. Compile Specialized Type-Safe Assembly",
    ],
    placeholder: "<T>",
    prompts: {
      default: "Define the generic type parameter <T> on the struct, class, or function.",
    },
    starters: {
      csharp: 'public class Box<T> {\n    public T Value { get; set; }\n}',
      javascript: 'function identity(value) {\n    return value;\n}',
      typescript: 'function identity<T>(value: T): T {\n    return value;\n}',
      python: 'from typing import TypeVar\nT = TypeVar("T")\ndef identity(val: T) -> T:\n    return val',
      rust: 'struct Box<T> {\n    value: T,\n}',
      go: 'type Box[T any] struct {\n    value T\n}',
      cpp: 'template <typename T>\nclass Box {\npublic:\n    T value;\n};',
      java: 'public class Box<T> {\n    private T value;\n}',
    },
    correctKeyword: "T",
  },
};

export function getMockAdaptiveLesson(
  language: LanguageId,
  lessonId: string,
  traitOverride?: PersonalityTrait
): AdaptiveLessonResponse {
  const trait = traitOverride || mockState.personality;
  const lecture = LECTURE_DATABASE[lessonId] || LECTURE_DATABASE.conditions;
  const langMeta = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.csharp;

  const starterCode =
    lecture.starters[language] || lecture.starters.csharp;

  if (trait === "ANALYTICAL") {
    return {
      lessonId,
      language,
      personality: "ANALYTICAL",
      presentationMode: "DEEP_EXPLANATION",
      title: `${langMeta.label}: ${lecture.title}`,
      louisMessage: lecture.analyticalMsg,
      explanation: lecture.analyticalExplanation,
      visualSteps: lecture.visualSteps,
      showExplanationFirst: true,
      exercise: {
        id: `${language}-${lessonId}-01`,
        type: "CODE",
        prompt: lecture.prompts.default,
        starterCode,
        placeholder: lecture.placeholder,
      },
    };
  } else if (trait === "PRACTICAL") {
    return {
      lessonId,
      language,
      personality: "PRACTICAL",
      presentationMode: "PRACTICE_FIRST",
      title: `${langMeta.label}: ${lecture.title}`,
      louisMessage: lecture.practicalMsg,
      explanation: null,
      showExplanationFirst: false,
      exercise: {
        id: `${language}-${lessonId}-01`,
        type: "FILL_BLANK",
        prompt: lecture.prompts.default,
        starterCode,
        placeholder: lecture.placeholder,
      },
    };
  } else {
    return {
      lessonId,
      language,
      personality: "VISUAL",
      presentationMode: "VISUAL_GUIDED",
      title: `${langMeta.label}: ${lecture.title}`,
      louisMessage: lecture.visualMsg,
      explanation: `Step-by-step logic flow for ${langMeta.label} ${lecture.title}.`,
      visualSteps: lecture.visualSteps,
      showExplanationFirst: false,
      exercise: {
        id: `${language}-${lessonId}-01`,
        type: "FILL_BLANK",
        prompt: lecture.prompts.default,
        starterCode,
        placeholder: lecture.placeholder,
      },
    };
  }
}

export function evaluateMockExercise(req: EvaluateRequest): EvaluateResponse {
  const cleanAns = req.answer.toLowerCase().replace(/\s+/g, " ").trim();
  const lecture = LECTURE_DATABASE[req.lessonId] || LECTURE_DATABASE.conditions;
  const targetKey = lecture.correctKeyword.toLowerCase();

  // Answer is correct if it includes the lecture's target keyword or valid code
  const isCorrect =
    cleanAns.includes(targetKey) ||
    cleanAns.includes("age >= 18") ||
    cleanAns.includes("age>=18") ||
    cleanAns.includes("18") ||
    cleanAns.includes("score = 100") ||
    cleanAns.includes("hello") ||
    cleanAns.includes("a + b") ||
    cleanAns.includes("louis") ||
    cleanAns.includes("await") ||
    cleanAns.includes("catch") ||
    cleanAns.includes("except") ||
    cleanAns.includes("box") ||
    cleanAns.includes("<t>");

  if (isCorrect) {
    const prevStreak = mockState.streakCurrent;
    mockState.totalXp += 10;
    mockState.streakCurrent += 1;
    mockState.streakLongest = Math.max(mockState.streakLongest, mockState.streakCurrent);

    if (!mockState.completedLessons[req.language]) {
      mockState.completedLessons[req.language] = [];
    }

    if (!mockState.completedLessons[req.language].includes(req.lessonId)) {
      mockState.completedLessons[req.language].push(req.lessonId);
    }

    const completedCount = mockState.completedLessons[req.language].length;

    return {
      correct: true,
      xpAwarded: 10,
      feedback: {
        title: "Outstanding! 🎉",
        message: `Spot on! You mastered the ${lecture.title} challenge in ${
          SUPPORTED_LANGUAGES[req.language]?.label || req.language
        }.`,
      },
      progress: {
        lessonCompleted: true,
        languagePercentage: Math.min(
          100,
          Math.round((completedCount / TOTAL_LESSONS_PER_COURSE) * 100)
        ),
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
      message: `Review the syntax for ${lecture.title}. Look for: ${lecture.placeholder}`,
    },
    progress: {
      lessonCompleted: false,
      languagePercentage: Math.round(
        ((mockState.completedLessons[req.language]?.length || 0) /
          TOTAL_LESSONS_PER_COURSE) *
          100
      ),
    },
    streak: {
      previous: mockState.streakCurrent,
      current: mockState.streakCurrent,
      increased: false,
    },
  };
}
