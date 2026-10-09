"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/types";

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

export default function QuizRunner({ questions, onClose }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return null;
  const q = questions[index];

  function handleSelect(optIndex: number) {
    if (selected !== null) return;
    setSelected(optIndex);
    if (optIndex === q.correctIndex) setScore((s) => s + 1);
  }

  function next() {
    if (index < questions.length - 1) {
      setSelected(null);
      setIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <p className="text-4xl font-semibold text-slate-900 mb-2">
            {score}/{questions.length}
          </p>
          <p className="text-slate-500 mb-6">
            {score === questions.length ? "Perfect score!" : score >= questions.length / 2 ? "Good work, keep studying!" : "Review the material and try again."}
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-500">
            Question {index + 1} of {questions.length}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-slate-900 font-medium mb-4">{q.question}</p>

        <div className="space-y-2 mb-4">
          {q.options.map((opt, i) => {
            let style = "bg-white border-slate-200 hover:border-blue-300 text-slate-700";
            if (selected !== null) {
              if (i === q.correctIndex) style = "bg-green-50 border-green-300 text-green-800";
              else if (i === selected) style = "bg-red-50 border-red-300 text-red-800";
              else style = "bg-white border-slate-100 text-slate-400";
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-700">{q.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button
            onClick={next}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            {index < questions.length - 1 ? "Next question" : "See results"}
          </button>
        )}
      </div>
    </div>
  );
}
