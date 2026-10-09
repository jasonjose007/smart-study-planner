"use client";

import { useEffect, useState } from "react";
import { getPlan, toggleTopicComplete, saveFlashcards, getFlashcards, saveQuiz, getQuiz } from "@/lib/storage";
import { StudyPlan, Topic, Flashcard, QuizQuestion } from "@/lib/types";
import Navbar from "@/components/Navbar";
import TopicCard from "@/components/TopicCard";
import FlashcardViewer from "@/components/FlashcardViewer";
import QuizRunner from "@/components/QuizRunner";
import LoadingDots from "@/components/LoadingDots";

export default function TopicsPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [filter, setFilter] = useState("all");
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [quiz, setQuizState] = useState<QuizQuestion[] | null>(null);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  useEffect(() => {
    setPlan(getPlan());
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-12 text-center">
          <p className="text-slate-500 mb-4">No study plan yet.</p>
          <a href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">Create one</a>
        </main>
      </div>
    );
  }

  function handleToggle(id: string) {
    const updated = toggleTopicComplete(id);
    if (updated) setPlan({ ...updated });
  }

  async function handleFlashcards(topic: Topic) {
    const cached = getFlashcards(topic.name);
    if (cached.length > 0) {
      setFlashcards(cached);
      return;
    }
    setLoadingType(`flashcards-${topic.id}`);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.name, subject: topic.subject }),
      });
      if (!res.ok) throw new Error();
      const cards = await res.json();
      saveFlashcards(topic.name, cards);
      setFlashcards(cards);
    } catch {
      alert("Failed to generate flashcards. Try again.");
    }
    setLoadingType(null);
  }

  async function handleQuiz(topic: Topic) {
    const cached = getQuiz(topic.name);
    if (cached.length > 0) {
      setQuizState(cached);
      return;
    }
    setLoadingType(`quiz-${topic.id}`);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.name, subject: topic.subject }),
      });
      if (!res.ok) throw new Error();
      const questions = await res.json();
      saveQuiz(topic.name, questions);
      setQuizState(questions);
    } catch {
      alert("Failed to generate quiz. Try again.");
    }
    setLoadingType(null);
  }

  const subjects = ["all", ...plan.subjects];
  const filtered = filter === "all" ? plan.topics : plan.topics.filter((t) => t.subject === filter);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 mb-1">Topics</h1>
            <p className="text-sm text-slate-500">
              {filtered.length} topics — click any to generate flashcards or a quiz
            </p>
          </div>
          <div className="flex items-center gap-1">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  filter === s
                    ? "font-medium bg-white border border-slate-200 text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {loadingType && <LoadingDots text="Generating with Nemotron..." />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onToggle={handleToggle}
              onFlashcards={handleFlashcards}
              onQuiz={handleQuiz}
            />
          ))}
        </div>
      </main>

      {flashcards && (
        <FlashcardViewer cards={flashcards} onClose={() => setFlashcards(null)} />
      )}
      {quiz && (
        <QuizRunner questions={quiz} onClose={() => setQuizState(null)} />
      )}
    </div>
  );
}
