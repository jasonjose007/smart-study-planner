"use client";

import { useEffect, useState } from "react";
import { getPlan, getQuiz, saveQuiz } from "@/lib/storage";
import { StudyPlan, Topic, QuizQuestion } from "@/lib/types";
import Navbar from "@/components/Navbar";
import QuizRunner from "@/components/QuizRunner";
import LoadingDots from "@/components/LoadingDots";

export default function QuizPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);

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

  async function startQuiz(topic: Topic) {
    const cached = getQuiz(topic.name);
    if (cached.length > 0) {
      setQuiz(cached);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.name, subject: topic.subject }),
      });
      if (!res.ok) throw new Error();
      const questions = await res.json();
      saveQuiz(topic.name, questions);
      setQuiz(questions);
    } catch {
      alert("Failed to generate quiz.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-900 mb-1">Quiz yourself</h1>
          <p className="text-sm text-slate-500">
            Pick a topic to generate a 5-question quiz powered by Nemotron.
          </p>
        </div>

        {loading && <LoadingDots text="Generating quiz..." />}

        <div className="space-y-2">
          {plan.topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => startQuiz(topic)}
              disabled={loading}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3.5 text-left hover:border-blue-300 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-900">{topic.name}</span>
                  <span className="text-xs text-slate-400 ml-2">{topic.subject}</span>
                </div>
                <span className={`text-[11px] px-1.5 py-0.5 rounded border ${
                  topic.difficulty === "easy" ? "bg-green-50 text-green-700 border-green-200" :
                  topic.difficulty === "medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {topic.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {quiz && <QuizRunner questions={quiz} onClose={() => setQuiz(null)} />}
    </div>
  );
}
