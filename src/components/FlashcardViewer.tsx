"use client";

import { useState } from "react";
import { Flashcard } from "@/lib/types";

interface FlashcardViewerProps {
  cards: Flashcard[];
  onClose: () => void;
}

export default function FlashcardViewer({ cards, onClose }: FlashcardViewerProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;
  const card = cards[index];

  function next() {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, cards.length - 1));
  }

  function prev() {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-500">
            {index + 1} of {cards.length} — {card.topic}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => setFlipped(!flipped)}
          className="w-full min-h-[200px] bg-slate-50 border border-slate-200 rounded-lg p-6 text-center hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <p className="text-xs text-slate-400 mb-3">{flipped ? "Answer" : "Question"}</p>
          <p className={`text-lg ${flipped ? "text-blue-700" : "text-slate-900"}`}>
            {flipped ? card.back : card.front}
          </p>
          {!flipped && (
            <p className="text-xs text-slate-400 mt-4">Click to reveal</p>
          )}
        </button>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prev}
            disabled={index === 0}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:text-slate-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={next}
            disabled={index === cards.length - 1}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
