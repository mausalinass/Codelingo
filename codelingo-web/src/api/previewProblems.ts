import type { AdaptiveLessonResponse, LanguageId, LearningMode } from "../types/api";

type Exercise = AdaptiveLessonResponse["exercise"];
export type PreviewProblem = NonNullable<Exercise["problems"]>[number] & { correctAnswer: string };

const sourcePhrases = [
  "Hello, Louis!", "Good morning", "Thank you", "Please", "My name is Alex",
  "How are you?", "I like learning", "See you tomorrow", "Good night", "Goodbye",
];

const translations: Record<string, string[]> = {
  spanish: ["¡Hola, Louis!", "Buenos días", "Gracias", "Por favor", "Me llamo Alex", "¿Cómo estás?", "Me gusta aprender", "Hasta mañana", "Buenas noches", "Adiós"],
  french: ["Bonjour, Louis !", "Bonjour", "Merci", "S'il vous plaît", "Je m'appelle Alex", "Comment ça va ?", "J'aime apprendre", "À demain", "Bonne nuit", "Au revoir"],
  german: ["Hallo, Louis!", "Guten Morgen", "Danke", "Bitte", "Ich heiße Alex", "Wie geht es dir?", "Ich lerne gern", "Bis morgen", "Gute Nacht", "Auf Wiedersehen"],
  japanese: ["こんにちは、ルイス！", "おはようございます", "ありがとう", "お願いします", "私はアレックスです", "お元気ですか？", "学ぶことが好きです", "また明日", "おやすみなさい", "さようなら"],
  italian: ["Ciao, Louis!", "Buongiorno", "Grazie", "Per favore", "Mi chiamo Alex", "Come stai?", "Mi piace imparare", "A domani", "Buona notte", "Arrivederci"],
  portuguese: ["Olá, Louis!", "Bom dia", "Obrigado", "Por favor", "Meu nome é Alex", "Como você está?", "Eu gosto de aprender", "Até amanhã", "Boa noite", "Tchau"],
  mandarin: ["你好，路易斯！", "早上好", "谢谢", "请", "我叫亚历克斯", "你好吗？", "我喜欢学习", "明天见", "晚安", "再见"],
  korean: ["안녕, 루이스!", "좋은 아침이에요", "감사합니다", "부탁합니다", "제 이름은 알렉스입니다", "어떻게 지내세요?", "저는 배우는 것을 좋아해요", "내일 봐요", "안녕히 주무세요", "안녕히 가세요"],
  russian: ["Привет, Луис!", "Доброе утро", "Спасибо", "Пожалуйста", "Меня зовут Алекс", "Как дела?", "Мне нравится учиться", "До завтра", "Спокойной ночи", "До свидания"],
  arabic: ["مرحبًا، لويس!", "صباح الخير", "شكرًا", "من فضلك", "اسمي أليكس", "كيف حالك؟", "أحب التعلم", "أراك غدًا", "تصبح على خير", "إلى اللقاء"],
};

function styledPrompt(mode: LearningMode, number: number, task: string) {
  if (mode === "VISUAL_GUIDED") return `Visual flow ${number}: INPUT → PATTERN → ANSWER. ${task}`;
  if (mode === "PRACTICE_FIRST") return `Quick practice ${number}: ${task}`;
  return `Analyze the structure in challenge ${number}, then answer: ${task}`;
}

function mathProblem(lessonId: string, i: number) {
  const n = i + 1;
  let prompt: string;
  let answer: string;
  if (lessonId === "math_multiplication") { const a = n + 1, b = 2 + i % 5; prompt = `${a} × ${b} = ?`; answer = String(a * b); }
  else if (lessonId === "math_division") { const b = 2 + i % 4, q = n + 2; prompt = `${b * q} ÷ ${b} = ?`; answer = String(q); }
  else if (lessonId === "math_fractions") { const d = n + 2; prompt = `What fraction represents ${n} selected parts out of ${d}?`; answer = `${n}/${d}`; }
  else if (lessonId === "math_decimals") { const a = n + 0.5, b = i + 0.25; prompt = `${a} + ${b} = ?`; answer = String(a + b); }
  else if (lessonId === "math_algebra") { const x = n + 2, add = i + 1; prompt = `Solve x + ${add} = ${x + add}`; answer = String(x); }
  else if (lessonId === "math_geometry") { const w = n + 2, h = i + 3; prompt = `Find the perimeter of a ${w} × ${h} rectangle.`; answer = String(2 * (w + h)); }
  else if (lessonId === "math_area") { const w = n + 2, h = i + 3; prompt = `Find the area of a ${w} × ${h} rectangle.`; answer = String(w * h); }
  else if (lessonId === "math_order" || lessonId === "math_challenge") { const a = n, b = i + 2, c = 2 + i % 3; prompt = `${a} + ${b} × ${c} = ?`; answer = String(a + b * c); }
  else { const a = n + 2, b = i + 3; prompt = `${a} + ${b} = ?`; answer = String(a + b); }
  return { prompt, answer };
}

export function buildPreviewProblems(language: LanguageId, lessonId: string, mode: LearningMode, exercise: Exercise): PreviewProblem[] {
  if (exercise.type === "WORD_BANK") {
    const targets = translations[language] ?? translations.spanish;
    return targets.map((target, index) => {
      const task = `Translate “${sourcePhrases[index]}” into ${language}.`;
      const tokens = target.split(/\s+/).filter(Boolean);
      return {
        id: `${exercise.id}-p${index + 1}`,
        prompt: styledPrompt(mode, index + 1, task),
        goal: task,
        starterCode: "",
        visualSteps: [`Read: ${sourcePhrases[index]}`, "Match each idea", `Build: ${target}`],
        targetSentence: sourcePhrases[index],
        audioText: sourcePhrases[index],
        wordBank: [...tokens, "Louis", "code"].sort((a, b) => (a.charCodeAt(0) + index) % 7 - (b.charCodeAt(0) + index) % 7),
        correctAnswer: target,
      };
    });
  }

  return Array.from({ length: 10 }, (_, index) => {
    const result = mathProblem(lessonId, index);
    const numeric = Number(result.answer);
    const choices = Number.isFinite(numeric) ? [numeric - 1, numeric, numeric + 1, numeric + 2].map(String) : [result.answer, "1/2", "2/3", "3/4"];
    return {
      id: `${exercise.id}-p${index + 1}`,
      prompt: styledPrompt(mode, index + 1, result.prompt),
      goal: result.prompt,
      starterCode: "",
      visualSteps: ["Identify the values", "Choose the operation", "Verify the result"],
      choices,
      placeholder: "Enter answer...",
      correctAnswer: result.answer,
    };
  });
}

export function publicProblems(problems: PreviewProblem[]): NonNullable<Exercise["problems"]> {
  return problems.map(({ correctAnswer: _correctAnswer, ...problem }) => problem);
}
