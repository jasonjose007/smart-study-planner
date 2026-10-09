export interface Topic {
  id: string;
  name: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedHours: number;
  completed: boolean;
}

export interface StudyPlan {
  examDate: string;
  subjects: string[];
  topics: Topic[];
  dailySchedule: DaySchedule[];
  createdAt: string;
}

export interface DaySchedule {
  date: string;
  topics: string[];
  hours: number;
}

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
