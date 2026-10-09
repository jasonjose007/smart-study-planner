"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { savePlan } from "@/lib/storage";
import Navbar from "@/components/Navbar";
import LoadingDots from "@/components/LoadingDots";

export default function HomePage() {
  const router = useRouter();
  const [syllabus, setSyllabus] = useState("");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!syllabus.trim() || !examDate) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabus: syllabus.trim(), examDate }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate plan");
      }

      const data = await res.json();
      savePlan({
        examDate,
        subjects: data.subjects,
        topics: data.topics,
        dailySchedule: data.dailySchedule,
        createdAt: new Date().toISOString(),
      });

      router.push("/plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Create your study plan
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Paste your syllabus or list of topics below. The AI will analyze it,
            break it into topics, and generate a day-by-day study schedule
            with flashcards and quizzes for each topic.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Syllabus or topics
            </label>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              placeholder={"Paste your syllabus, course outline, or list of topics here...\n\nExample:\nData Structures: Arrays, Linked Lists, Stacks, Queues, Trees, Graphs\nAlgorithms: Sorting, Searching, Dynamic Programming, Greedy\nDatabase: SQL, Normalization, Transactions, Indexing"}
              rows={10}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm leading-relaxed resize-y"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Exam date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={minDate}
              className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <LoadingDots text="Analyzing syllabus and building your plan..." />
          ) : (
            <button
              type="submit"
              disabled={!syllabus.trim() || !examDate}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              Generate study plan
            </button>
          )}
        </form>

        <div className="mt-10 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            Powered by NVIDIA Nemotron models on Nebius Token Factory
          </p>
        </div>
      </main>
    </div>
  );
}
