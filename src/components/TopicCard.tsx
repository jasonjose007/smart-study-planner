"use client";

import { Topic } from "@/lib/types";

interface TopicCardProps {
  topic: Topic;
  onToggle: (id: string) => void;
  onFlashcards: (topic: Topic) => void;
  onQuiz: (topic: Topic) => void;
}

const difficultyColor = {
  easy: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-red-50 text-red-700 border-red-200",
};

export default function TopicCard({ topic, onToggle, onFlashcards, onQuiz }: TopicCardProps) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-4 transition-colors ${topic.completed ? "opacity-60" : "hover:border-blue-300"}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(topic.id)}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            topic.completed
              ? "bg-blue-500 border-blue-500"
              : "border-slate-300 hover:border-blue-400"
          }`}
        >
          {topic.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium ${topic.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
              {topic.name}
            </span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded border ${difficultyColor[topic.difficulty]}`}>
              {topic.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{topic.subject}</span>
            <span>{topic.estimatedHours}h estimated</span>
          </div>
          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={() => onFlashcards(topic)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Flashcards
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => onQuiz(topic)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
