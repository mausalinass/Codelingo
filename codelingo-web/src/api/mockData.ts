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
  completedLessons: Partial<Record<LanguageId, string[]>>;
}

export const mockState: MockState = {
  totalXp: 120,
  streakCurrent: 4,
  streakLongest: 7,
  activeLanguage: "csharp",
  personality: "ANALYTICAL",
  completedLessons: {
    // Coding Tracks
    csharp: ["hello"],
    javascript: [],
    typescript: [],
    python: [],
    rust: [],
    go: [],
    cpp: [],
    java: [],
    kotlin: [],
    swift: [],
    // Spoken Language Tracks
    spanish: ["lang_greetings"],
    french: [],
    german: [],
    japanese: [],
    italian: [],
    portuguese: [],
    mandarin: [],
    korean: [],
    russian: [],
    arabic: [],
    // Mathematics Tracks
    math_basics: ["math_addition"],
    math_fractions: [],
    math_algebra: [],
    math_geometry: [],
    math_mental: [],
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
  starters: Partial<Record<LanguageId, string>>;
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
      kotlin: 'println("Hello, World!")',
      swift: 'print("Hello, World!")',
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
      kotlin: "val score: Int = 100",
      swift: "let score: Int = 100",
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
      kotlin: 'val age = 20\nif (age >= 18) {\n    println("Adult")\n}',
      swift: 'let age = 20\nif age >= 18 {\n    print("Adult")\n}',
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

// Database of Duolingo-style Spoken Language Lessons
const LANGUAGE_LECTURES: Record<
  string,
  {
    title: string;
    topic: string;
    prompts: Record<string, string>;
    targets: Record<string, string>;
    correct: Record<string, string>;
    wordBanks: Record<string, string[]>;
    audioTexts: Record<string, string>;
    explanation: string;
  }
> = {
  lang_greetings: {
    title: "Greetings & Basics",
    topic: "Hello, good morning & polite basics",
    prompts: {
      spanish: "Translate 'Hello, good morning!' into Spanish",
      french: "Translate 'Hello, how are you?' into French",
      german: "Translate 'Good morning, thank you!' into German",
      japanese: "Translate 'Hello / Good afternoon' into Japanese",
      italian: "Translate 'Good morning, please!' into Italian",
      portuguese: "Translate 'Hello, good morning!' into Portuguese",
      mandarin: "Translate 'Hello, good morning!' into Mandarin",
      korean: "Translate 'Hello, good morning!' into Korean",
      russian: "Translate 'Hello, good morning!' into Russian",
      arabic: "Translate 'Hello, good morning!' into Arabic",
    },
    targets: {
      spanish: "Hello, good morning!",
      french: "Hello, how are you?",
      german: "Good morning, thank you!",
      japanese: "Hello / Good afternoon",
      italian: "Good morning, please!",
      portuguese: "Hello, good morning!",
      mandarin: "Hello, good morning!",
      korean: "Hello, good morning!",
      russian: "Hello, good morning!",
      arabic: "Hello, good morning!",
    },
    correct: {
      spanish: "¡Hola, buenos días!",
      french: "Bonjour, comment ça va ?",
      german: "Guten Morgen, danke!",
      japanese: "こんにちは",
      italian: "Buongiorno, per favore!",
      portuguese: "Olá, bom dia!",
      mandarin: "你好，早上好！",
      korean: "안녕하세요, 좋은 아침이에요!",
      russian: "Здравствуйте, доброе утро!",
      arabic: "مرحباً، صباح الخير!",
    },
    wordBanks: {
      spanish: ["¡Hola,", "buenos", "días!", "adiós", "gracias", "por", "favor", "noche"],
      french: ["Bonjour,", "comment", "ça", "va", "?", "merci", "au revoir", "oui"],
      german: ["Guten", "Morgen,", "danke!", "Tschüss", "bitte", "ja", "nein"],
      japanese: ["こんにちは", "はじめまして", "ありがとう", "さようなら", "はい"],
      italian: ["Buongiorno,", "per", "favore!", "grazie", "ciao", "arrivederci"],
      portuguese: ["Olá,", "bom", "dia!", "adeus", "obrigado", "por", "favor", "noite"],
      mandarin: ["你好，", "早上好！", "再见", "谢谢", "请", "晚安"],
      korean: ["안녕하세요,", "좋은", "아침이에요!", "감사합니다", "안녕히 계세요"],
      russian: ["Здравствуйте,", "доброе", "утро!", "спасибо", "до свидания", "пожалуйста"],
      arabic: ["مرحباً،", "صباح", "الخير!", "شكراً", "مع السلامة", "من فضلك"],
    },
    audioTexts: {
      spanish: "¡Hola, buenos días!",
      french: "Bonjour, comment ça va ?",
      german: "Guten Morgen, danke!",
      japanese: "こんにちは",
      italian: "Buongiorno, per favore!",
      portuguese: "Olá, bom dia!",
      mandarin: "你好，早上好",
      korean: "안녕하세요 좋은 아침이에요",
      russian: "Здравствуйте, доброе утро!",
      arabic: "مرحباً صباح الخير",
    },
    explanation: "Greetings form the foundation of polite conversation across all everyday interactions.",
  },
  lang_phrases: {
    title: "Introductions & Common Phrases",
    topic: "Names, origin & common expressions",
    prompts: {
      spanish: "Translate 'My name is Alex' into Spanish",
      french: "Translate 'My name is Alex' into French",
      german: "Translate 'My name is Alex' into German",
      japanese: "Translate 'My name is Alex' into Japanese",
      italian: "Translate 'My name is Alex' into Italian",
      portuguese: "Translate 'My name is Alex' into Portuguese",
      mandarin: "Translate 'My name is Alex' into Mandarin",
      korean: "Translate 'My name is Alex' into Korean",
      russian: "Translate 'My name is Alex' into Russian",
      arabic: "Translate 'My name is Alex' into Arabic",
    },
    targets: {
      spanish: "My name is Alex",
      french: "My name is Alex",
      german: "My name is Alex",
      japanese: "My name is Alex",
      italian: "My name is Alex",
      portuguese: "My name is Alex",
      mandarin: "My name is Alex",
      korean: "My name is Alex",
      russian: "My name is Alex",
      arabic: "My name is Alex",
    },
    correct: {
      spanish: "Me llamo Alex",
      french: "Je m'appelle Alex",
      german: "Ich heiße Alex",
      japanese: "私はアレックスです",
      italian: "Mi chiamo Alex",
      portuguese: "Meu nome é Alex",
      mandarin: "我叫亚历克斯",
      korean: "제 이름은 알렉스입니다",
      russian: "Меня зовут Алекс",
      arabic: "اسمي أليكس",
    },
    wordBanks: {
      spanish: ["Me", "llamo", "Alex", "soy", "tú", "él", "amigo"],
      french: ["Je", "m'appelle", "Alex", "suis", "tu", "ami"],
      german: ["Ich", "heiße", "Alex", "bin", "du", "Freund"],
      japanese: ["私", "は", "アレックス", "です", "あなた", "友達"],
      italian: ["Mi", "chiamo", "Alex", "sono", "tu", "amico"],
      portuguese: ["Meu", "nome", "é", "Alex", "sou", "você", "amigo"],
      mandarin: ["我", "叫", "亚历克斯", "是", "你", "朋友"],
      korean: ["제", "이름은", "알렉스입니다", "저는", "친구", "입니다"],
      russian: ["Меня", "зовут", "Алекс", "я", "твой", "друг"],
      arabic: ["اسمي", "أليكس", "أنا", "صديق", "أنت"],
    },
    audioTexts: {
      spanish: "Me llamo Alex",
      french: "Je m'appelle Alex",
      german: "Ich heiße Alex",
      japanese: "私はアレックスです",
      italian: "Mi chiamo Alex",
      portuguese: "Meu nome é Alex",
      mandarin: "我叫亚历克斯",
      korean: "제 이름은 알렉스입니다",
      russian: "Меня зовут Алекс",
      arabic: "اسمي أليكس",
    },
    explanation: "Introducing yourself uses reflexive verb structures in Romance languages.",
  },
  lang_food: {
    title: "Food & Dining",
    topic: "Ordering meals, coffee & restaurant phrases",
    prompts: {
      spanish: "Translate 'A coffee with milk, please' into Spanish",
      french: "Translate 'A croissant and coffee, please' into French",
      german: "Translate 'A coffee with milk, please' into German",
      japanese: "Translate 'Water, please' into Japanese",
      italian: "Translate 'An espresso, please' into Italian",
      portuguese: "Translate 'A coffee with milk, please' into Portuguese",
      mandarin: "Translate 'Water, please' into Mandarin",
      korean: "Translate 'Water, please' into Korean",
      russian: "Translate 'A coffee with milk, please' into Russian",
      arabic: "Translate 'Coffee, please' into Arabic",
    },
    targets: {
      spanish: "A coffee with milk, please",
      french: "A croissant and coffee, please",
      german: "A coffee with milk, please",
      japanese: "Water, please",
      italian: "An espresso, please",
      portuguese: "A coffee with milk, please",
      mandarin: "Water, please",
      korean: "Water, please",
      russian: "A coffee with milk, please",
      arabic: "Coffee, please",
    },
    correct: {
      spanish: "Un café con leche, por favor",
      french: "Un croissant et un café, s'il vous plaît",
      german: "Ein Kaffee mit Milch, bitte",
      japanese: "お水をください",
      italian: "Un espresso, per favore",
      portuguese: "Um café com leite, por favor",
      mandarin: "请给我水",
      korean: "물 좀 주세요",
      russian: "Кофе с молоком, пожалуйста",
      arabic: "قهوة من فضلك",
    },
    wordBanks: {
      spanish: ["Un", "café", "con", "leche,", "por", "favor", "agua", "pan"],
      french: ["Un", "croissant", "et", "un", "café,", "s'il", "vous", "plaît"],
      german: ["Ein", "Kaffee", "mit", "Milch,", "bitte", "Wasser", "Brot"],
      japanese: ["お水", "を", "ください", "お茶", "ご飯"],
      italian: ["Un", "espresso,", "per", "favore", "acqua", "pane"],
      portuguese: ["Um", "café", "com", "leite,", "por", "favor", "água", "pão"],
      mandarin: ["请", "给我", "水", "茶", "米饭", "谢谢"],
      korean: ["물", "좀", "주세요", "커피", "밥", "감사합니다"],
      russian: ["Кофе", "с", "молоком,", "пожалуйста", "вода", "чай", "хлеб"],
      arabic: ["قهوة", "من", "فضلك", "ماء", "شاي", "خبز"],
    },
    audioTexts: {
      spanish: "Un café con leche, por favor",
      french: "Un croissant et un café, s'il vous plaît",
      german: "Ein Kaffee mit Milch, bitte",
      japanese: "お水をください",
      italian: "Un espresso, per favore",
      portuguese: "Um café com leite, por favor",
      mandarin: "请给我水",
      korean: "물 좀 주세요",
      russian: "Кофе с молоком, пожалуйста",
      arabic: "قهوة من فضلك",
    },
    explanation: "Polite ordering requires gender agreement with nouns and polite suffixes.",
  },
};

// Database of Duolingo-style Mathematics Lessons
const MATH_LECTURES: Record<
  string,
  {
    title: string;
    topic: string;
    prompt: string;
    correct: string;
    choices?: string[];
    explanation: string;
    mathVisual?: {
      type: "fraction_pie" | "grid_array" | "equation" | "geometry_shape";
      title?: string;
      value?: string | number;
      numerator?: number;
      denominator?: number;
      rows?: number;
      cols?: number;
      shape?: "triangle" | "rectangle" | "circle";
      dimensions?: string;
    };
  }
> = {
  math_addition: {
    title: "Addition & Mental Math",
    topic: "Place value, mental regrouping & speed addition",
    prompt: "Calculate the sum: 47 + 38 = ?",
    correct: "85",
    choices: ["75", "85", "95", "83"],
    explanation: "Mental trick: Add tens first (40 + 30 = 70), then add units (7 + 8 = 15). 70 + 15 = 85.",
  },
  math_multiplication: {
    title: "Multiplication Arrays",
    topic: "Grid arrays, visual area models & product",
    prompt: "What is the product of 4 rows and 6 columns? (4 × 6 = ?)",
    correct: "24",
    choices: ["20", "24", "28", "18"],
    explanation: "Multiplication represents repeated addition: 4 rows of 6 dots equals 24 total dots.",
    mathVisual: {
      type: "grid_array",
      rows: 4,
      cols: 6,
      title: "4 rows × 6 columns array",
    },
  },
  math_division: {
    title: "Division & Equal Sharing",
    topic: "Equal distribution, quotients & inverse factors",
    prompt: "Divide 36 candies equally among 4 friends. (36 ÷ 4 = ?)",
    correct: "9",
    choices: ["8", "9", "6", "12"],
    explanation: "Division is the inverse of multiplication: Since 4 × 9 = 36, each friend gets 9 candies.",
  },
  math_fractions: {
    title: "Fractions as Parts of a Whole",
    topic: "Numerator, denominator & visual fraction models",
    prompt: "A pizza has 8 slices. If 5 slices remain, what fraction is left?",
    correct: "5/8",
    choices: ["3/8", "5/8", "1/2", "4/8"],
    explanation: "The denominator (8) is total parts. The numerator (5) is remaining parts: 5/8.",
    mathVisual: {
      type: "fraction_pie",
      numerator: 5,
      denominator: 8,
      title: "5 of 8 slices remaining",
    },
  },
  math_decimals: {
    title: "Decimals & Currency",
    topic: "Tenths, hundredths & decimal addition",
    prompt: "Add the currency values: $3.75 + $2.50 = ?",
    correct: "6.25",
    choices: ["5.25", "6.25", "6.15", "6.75"],
    explanation: "Align decimal points: $3.75 + $2.50 = $6.25.",
  },
  math_algebra: {
    title: "Solving Linear Unknowns (X)",
    topic: "Balancing equations & isolate variables",
    prompt: "Solve for x: 3x + 6 = 21. What is the value of x?",
    correct: "5",
    choices: ["3", "5", "7", "9"],
    explanation: "Subtract 6 from both sides: 3x = 15. Divide by 3: x = 5.",
  },
  math_geometry: {
    title: "Geometry: Rectangular Area",
    topic: "Area formula: Width × Height",
    prompt: "A rectangle has width 8 cm and height 5 cm. What is its Area in square cm?",
    correct: "40",
    choices: ["26", "40", "35", "48"],
    explanation: "Area of a rectangle = Width × Height = 8 × 5 = 40 cm².",
    mathVisual: {
      type: "geometry_shape",
      dimensions: "Width: 8 cm • Height: 5 cm",
      title: "Rectangle Area: 8 × 5",
    },
  },
  math_area: {
    title: "Triangle Area Formula",
    topic: "(Base × Height) ÷ 2",
    prompt: "A triangle has base 10 cm and height 6 cm. Find its Area: (10 × 6) ÷ 2 = ?",
    correct: "30",
    choices: ["60", "30", "16", "25"],
    explanation: "Area of triangle is half of rectangle: (10 × 6) / 2 = 60 / 2 = 30 cm².",
  },
  math_order: {
    title: "Order of Operations (PEMDAS)",
    topic: "Parentheses, Multiplication & Addition Priority",
    prompt: "Evaluate: 6 + 4 × 5 = ?",
    correct: "26",
    choices: ["50", "26", "30", "24"],
    explanation: "Multiplication precedes addition! 4 × 5 = 20, then 6 + 20 = 26.",
  },
  math_challenge: {
    title: "Mental Math Speed Challenge",
    topic: "Multi-step mental arithmetic",
    prompt: "Double 35, add 15, then divide by 5: ((35 × 2) + 15) ÷ 5 = ?",
    correct: "17",
    choices: ["15", "17", "19", "21"],
    explanation: "Step 1: 35 × 2 = 70. Step 2: 70 + 15 = 85. Step 3: 85 ÷ 5 = 17.",
  },
};

export function getMockAdaptiveLesson(
  language: LanguageId,
  lessonId: string,
  traitOverride?: PersonalityTrait
): AdaptiveLessonResponse {
  const trait = traitOverride || mockState.personality;
  const langMeta = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.csharp;

  // 1. Spoken Language Track (Duolingo Style Word Bank)
  if (langMeta.subject === "language") {
    const lecture = LANGUAGE_LECTURES[lessonId] || LANGUAGE_LECTURES.lang_greetings;
    const prompt = lecture.prompts[language] || lecture.prompts.spanish;
    const targetSentence = lecture.targets[language] || lecture.targets.spanish;
    const wordBank = lecture.wordBanks[language] || lecture.wordBanks.spanish;
    const audioText = lecture.audioTexts[language] || lecture.audioTexts.spanish;

    const greetingsMap: Record<string, string> = {
      spanish: "¡Hola! Louis is here to coach your Spanish pronunciation & grammar!",
      french: "Bonjour ! Let's practice French vocabulary and sentence flow!",
      german: "Guten Tag! Master your German grammar with daily consistency!",
      japanese: "Konnichiwa! Let's build your Japanese conversational skills!",
      italian: "Ciao! Enjoy learning authentic Italian dialogue and culture!",
    };

    return {
      lessonId,
      language,
      personality: trait,
      presentationMode: "PRACTICE_FIRST",
      title: `${langMeta.label}: ${lecture.title}`,
      louisMessage: greetingsMap[language] || "Practice makes fluent! Build the translated sentence.",
      explanation: lecture.explanation,
      visualSteps: [
        "1. Read source sentence and listen to pronunciation",
        "2. Select vocabulary chips from word bank",
        "3. Check sentence syntax and word order",
      ],
      showExplanationFirst: false,
      exercise: {
        id: `${language}-${lessonId}-01`,
        type: "WORD_BANK",
        prompt,
        targetSentence,
        wordBank,
        audioText,
      },
    };
  }

  // 2. Mathematics Track (Duolingo Math Style)
  if (langMeta.subject === "math") {
    const lecture = MATH_LECTURES[lessonId] || MATH_LECTURES.math_addition;
    return {
      lessonId,
      language,
      personality: trait,
      presentationMode: "PRACTICE_FIRST",
      title: `${langMeta.label}: ${lecture.title}`,
      louisMessage: "Let's crunch the numbers! Use logic and step-by-step arithmetic.",
      explanation: lecture.explanation,
      visualSteps: [
        "1. Identify the given mathematical terms",
        "2. Apply operation priority (PEMDAS)",
        "3. Compute final value & verify with keypad",
      ],
      showExplanationFirst: false,
      exercise: {
        id: `${language}-${lessonId}-01`,
        type: "MATH_INPUT",
        prompt: lecture.prompt,
        choices: lecture.choices,
        mathVisual: lecture.mathVisual,
        placeholder: "Enter number...",
      },
    };
  }

  // 3. Programming Languages (Existing Coding Track)
  const lecture = LECTURE_DATABASE[lessonId] || LECTURE_DATABASE.conditions;
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
  const langMeta = SUPPORTED_LANGUAGES[req.language] || SUPPORTED_LANGUAGES.csharp;

  let isCorrect = false;
  let successMsg = "Outstanding! 🎉";
  let failureMsg = "Review the answer and try again.";

  // Evaluate Spoken Language Answers
  if (langMeta.subject === "language") {
    const lecture = LANGUAGE_LECTURES[req.lessonId] || LANGUAGE_LECTURES.lang_greetings;
    const targetCorrect = (lecture.correct[req.language] || "").toLowerCase().trim();
    // Allow matching punctuation-free or exact
    const cleanCorrect = targetCorrect.replace(/[¡!¿?,.]/g, "").replace(/\s+/g, " ").trim();
    const cleanUser = cleanAns.replace(/[¡!¿?,.]/g, "").replace(/\s+/g, " ").trim();

    isCorrect = cleanUser === cleanCorrect || cleanAns.includes(cleanCorrect) || cleanCorrect.includes(cleanUser);
    successMsg = `¡Excelente! Spot-on translation in ${langMeta.label}.`;
    failureMsg = `Check word order. Target: ${lecture.correct[req.language] || "Correct sentence"}`;
  }
  // Evaluate Math Answers
  else if (langMeta.subject === "math") {
    const lecture = MATH_LECTURES[req.lessonId] || MATH_LECTURES.math_addition;
    const cleanCorrect = lecture.correct.toLowerCase().trim();
    // Check exact number or choice
    isCorrect =
      cleanAns === cleanCorrect ||
      cleanAns.includes(cleanCorrect) ||
      cleanAns.replace("$", "").trim() === cleanCorrect;
    successMsg = `Spot-on calculation! You solved this ${langMeta.label} challenge.`;
    failureMsg = `Not quite. Expected: ${lecture.correct}`;
  }
  // Evaluate Coding Answers
  else {
    const lecture = LECTURE_DATABASE[req.lessonId] || LECTURE_DATABASE.conditions;
    const targetKey = lecture.correctKeyword.toLowerCase();

    isCorrect =
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
    successMsg = `Spot on! You mastered the ${lecture.title} challenge in ${langMeta.label}.`;
    failureMsg = `Review the syntax for ${lecture.title}. Look for: ${lecture.placeholder}`;
  }

  if (isCorrect) {
    const prevStreak = mockState.streakCurrent;
    mockState.totalXp += 10;
    mockState.streakCurrent += 1;
    mockState.streakLongest = Math.max(mockState.streakLongest, mockState.streakCurrent);

    const userCompleted = mockState.completedLessons[req.language] || [];
    mockState.completedLessons[req.language] = userCompleted;

    if (!userCompleted.includes(req.lessonId)) {
      userCompleted.push(req.lessonId);
    }

    const completedCount = userCompleted.length;

    return {
      correct: true,
      xpAwarded: 10,
      feedback: {
        title: "Outstanding! 🎉",
        message: successMsg,
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
      message: failureMsg,
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

