"use client";

import { useEffect, useState } from "react";
import { getPlan, clearPlan } from "@/lib/storage";
import { StudyPlan } from "@/lib/types";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    setPlan(getPlan());
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-12 text-center">
          <p className="text-slate-500 mb-4">No study plan yet.</p>
          <a href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Create one
          </a>
        </main>
      </div>
    );
  }

  const totalTopics = plan.topics.length;
  const completed = plan.topics.filter((t) => t.completed).length;
  const totalHours = plan.topics.reduce((sum, t) => sum + t.estimatedHours, 0);
  const daysLeft = Math.max(0, Math.ceil((new Date(plan.examDate).getTime() - Date.now()) / 86400000));

  function handleReset() {
    clearPlan();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 mb-1">Your study plan</h1>
            <p className="text-sm text-slate-500">
              {plan.subjects.join(", ")} — exam on {new Date(plan.examDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-slate-400 hover:text-red-500 transition-colors"
          >
            Reset plan
          </button>
        </div>

        <div className="flex items-end gap-12 mb-10">
          <div>
            <p className="text-3xl font-semibold text-slate-900 tabular-nums">{daysLeft}</p>
            <p className="text-sm text-slate-500">days left</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900 tabular-nums">{completed}/{totalTopics}</p>
            <p className="text-sm text-slate-500">topics done</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900 tabular-nums">{totalHours}</p>
            <p className="text-sm text-slate-500">hours total</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900 tabular-nums">{plan.subjects.length}</p>
            <p className="text-sm text-slate-500">subjects</p>
          </div>
        </div>

        <h2 className="text-base font-semibold text-slate-900 mb-4">Daily schedule</h2>
        <div className="space-y-2">
          {plan.dailySchedule.map((day) => {
            const date = new Date(day.date);
            const isToday = new Date().toDateString() === date.toDateString();
            const isPast = date < new Date() && !isToday;
            return (
              <div
                key={day.date}
                className={`bg-white border rounded-lg px-4 py-3 flex items-center justify-between ${
                  isToday ? "border-blue-300 bg-blue-50/50" : isPast ? "border-slate-100 opacity-50" : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-medium w-24 ${isToday ? "text-blue-600" : "text-slate-500"}`}>
                    {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <span className="text-sm text-slate-700">
                    {day.topics.join(", ")}
                  </span>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{day.hours}h</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
