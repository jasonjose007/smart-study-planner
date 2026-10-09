"use client";

export default function LoadingDots({ text = "Loading" }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 py-8 justify-center">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-sm text-slate-500">{text}</span>
    </div>
  );
}
