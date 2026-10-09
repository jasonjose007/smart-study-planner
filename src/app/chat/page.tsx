"use client";

import { useEffect, useState, useRef } from "react";
import { getPlan, getChatHistory, saveChatHistory } from "@/lib/storage";
import { StudyPlan, ChatMessage } from "@/lib/types";
import Navbar from "@/components/Navbar";

export default function ChatPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlan(getPlan());
    setMessages(getChatHistory());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          subjects: plan?.subjects || [],
          topics: plan?.topics.map((t) => t.name) || [],
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      const assistantMsg: ChatMessage = { role: "assistant", content: data.content };
      const withResponse = [...updated, assistantMsg];
      setMessages(withResponse);
      saveChatHistory(withResponse);
    } catch {
      const errorMsg: ChatMessage = { role: "assistant", content: "Sorry, something went wrong. Try again." };
      setMessages([...updated, errorMsg]);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-900 mb-1">Study tutor</h1>
          <p className="text-sm text-slate-500">
            Ask anything about your study topics. Powered by Nemotron.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 text-sm">Ask a question about your study material to get started.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any topic..."
            className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
