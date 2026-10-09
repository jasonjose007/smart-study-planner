import { StudyPlan, Flashcard, QuizQuestion, ChatMessage } from "./types";

const PLAN_KEY = "ssp-plan";
const FLASHCARDS_KEY = "ssp-flashcards";
const QUIZ_KEY = "ssp-quiz";
const CHAT_KEY = "ssp-chat";

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getPlan(): StudyPlan | null {
  return get<StudyPlan | null>(PLAN_KEY, null);
}

export function savePlan(plan: StudyPlan): void {
  set(PLAN_KEY, plan);
}

export function clearPlan(): void {
  localStorage.removeItem(PLAN_KEY);
  localStorage.removeItem(FLASHCARDS_KEY);
  localStorage.removeItem(QUIZ_KEY);
  localStorage.removeItem(CHAT_KEY);
}

export function toggleTopicComplete(topicId: string): StudyPlan | null {
  const plan = getPlan();
  if (!plan) return null;
  plan.topics = plan.topics.map((t) =>
    t.id === topicId ? { ...t, completed: !t.completed } : t
  );
  savePlan(plan);
  return plan;
}

export function getFlashcards(topic: string): Flashcard[] {
  const all = get<Record<string, Flashcard[]>>(FLASHCARDS_KEY, {});
  return all[topic] || [];
}

export function saveFlashcards(topic: string, cards: Flashcard[]): void {
  const all = get<Record<string, Flashcard[]>>(FLASHCARDS_KEY, {});
  all[topic] = cards;
  set(FLASHCARDS_KEY, all);
}

export function getQuiz(topic: string): QuizQuestion[] {
  const all = get<Record<string, QuizQuestion[]>>(QUIZ_KEY, {});
  return all[topic] || [];
}

export function saveQuiz(topic: string, questions: QuizQuestion[]): void {
  const all = get<Record<string, QuizQuestion[]>>(QUIZ_KEY, {});
  all[topic] = questions;
  set(QUIZ_KEY, all);
}

export function getChatHistory(): ChatMessage[] {
  return get<ChatMessage[]>(CHAT_KEY, []);
}

export function saveChatHistory(messages: ChatMessage[]): void {
  set(CHAT_KEY, messages);
}
