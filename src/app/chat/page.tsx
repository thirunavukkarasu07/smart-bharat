"use client";

import { useState, useRef, useEffect } from "react";
import { CIVIC_CHAT_PROMPT } from "@/lib/prompts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content:
        "Namaste! Vanakkam! Hello! I am Smart Bharat, your civic assistant. How can I help you today?\n\n🇮🇳 *Ask me about government schemes, ration cards, applications, or complaints in Hindi, Tamil, or English.*",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "chat",
          input: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to Civic AI");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: data.text || "I could not generate an answer. Please try again.",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content:
            "⚠️ Error connecting to the civic assistant. Please check your internet connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const currentInput = input;
    setInput("");
    handleSendMessage(currentInput);
  };

  // Helper to format line breaks and markdown-style bold text securely
  const renderFormattedText = (text: string) => {
    return text.split("\n").map((line, lineIndex) => {
      // Find matches for *bold* or **bold**
      const parts = line.split(/(\*\*?[^*]+\*\*?)/g);
      
      const parsedLine = parts.map((part, partIndex) => {
        if (
          (part.startsWith("**") && part.endsWith("**")) ||
          (part.startsWith("*") && part.endsWith("*"))
        ) {
          const isDouble = part.startsWith("**");
          const cleanedText = isDouble ? part.slice(2, -2) : part.slice(1, -1);
          return (
            <strong
              key={partIndex}
              className="font-bold text-slate-900 dark:text-amber-100"
            >
              {cleanedText}
            </strong>
          );
        }
        return part;
      });

      return (
        <div key={lineIndex} className={line.trim() === "" ? "h-3" : "min-h-[1.25rem]"}>
          {parsedLine}
        </div>
      );
    });
  };

  const suggestions = [
    { text: "How to apply for a ration card?", label: "Ration Card" },
    { text: "PM-KISAN eligibility guidelines", label: "PM-KISAN" },
    { text: "How to report a garbage issue?", label: "Report Issue" },
  ];

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-zinc-950 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none dark:bg-orange-950/10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none dark:bg-emerald-950/10"></div>

      {/* Flag accent stripe at the very top */}
      <div className="h-1.5 w-full flex">
        <div className="h-full flex-1 bg-[#FF9933]"></div>
        <div className="h-full flex-1 bg-white"></div>
        <div className="h-full flex-1 bg-[#138808]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60 dark:bg-zinc-900/80 dark:border-zinc-800/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808] p-0.5 flex items-center justify-center shadow-sm">
            <div className="h-full w-full bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold bg-gradient-to-r from-[#FF9933] via-blue-700 to-[#138808] bg-clip-text text-transparent">SB</span>
            </div>
          </div>
          <div>
            <h1 id="chat-title" className="text-lg font-bold text-slate-900 dark:text-zinc-50 leading-tight">
              Civic AI Chat
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
              🇮🇳 हिंदी · தமிழ் · English
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInfoModal(true)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
          type="button"
          title="AI Rules & Instructions"
          aria-label="View system details"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 111.083.984l-.04.02-1.083-.984zm1.5 1.5l.041-.02a.75.75 0 111.083.984l-.04.02-1.083-.984zm-6.75 3h12a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v7.5A2.25 2.25 0 006.75 16.5z"
            />
          </svg>
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-3xl w-full mx-auto flex flex-col z-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === "user" ? "self-end ml-auto" : "self-start mr-auto"
            }`}
          >
            {/* Sender Identifier */}
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider mb-1 px-1 text-slate-400 dark:text-zinc-500 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {msg.role === "user" ? "Citizen" : "Smart Bharat AI"}
            </span>

            {/* Message Bubble */}
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-[#FF9933] to-[#E65A28] text-white rounded-tr-none"
                  : "bg-white border-l-4 border-[#138808] text-slate-800 dark:bg-zinc-900 dark:border-[#138808] dark:text-zinc-200 rounded-tl-none"
              }`}
            >
              <div className="space-y-1">{renderFormattedText(msg.content)}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex flex-col max-w-[85%] self-start mr-auto">
            <span className="text-[10px] font-semibold uppercase tracking-wider mb-1 px-1 text-slate-400 dark:text-zinc-500">
              Smart Bharat AI
            </span>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white border-l-4 border-slate-300 dark:bg-zinc-900 dark:border-zinc-700 shadow-sm">
              <div className="flex items-center gap-1.5 py-1">
                <div
                  className="w-2 h-2 rounded-full bg-[#FF9933] animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-[#138808] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium ml-1.5">
                  typing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Footer Area with Input */}
      <footer className="sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50/95 to-slate-50/0 dark:from-zinc-950 dark:via-zinc-950/95 dark:to-zinc-950/0 px-4 py-4 max-w-3xl w-full mx-auto z-10">
        {/* Suggestion Chips (only when list has just the greeting and not loading) */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 mb-3 justify-center">
            {suggestions.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.text)}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                💡 {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-1.5 shadow-md focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all"
        >
          <input
            type="text"
            aria-label="Type your civic question in Hindi, Tamil, or English"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask in Hindi, Tamil, or English…"
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-2.5 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? "bg-gradient-to-r from-[#FF9933] to-[#E65A28] text-white shadow-md shadow-orange-500/10 hover:brightness-105 cursor-pointer"
                : "bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4.5 h-4.5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </footer>

      {/* Info Modal / Rules overlay */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 p-0 animate-in fade-in zoom-in-95 duration-200">
            {/* Tricolor flag stripe for modal header */}
            <div className="h-1.5 w-full flex">
              <div className="h-full flex-1 bg-[#FF9933]"></div>
              <div className="h-full flex-1 bg-white"></div>
              <div className="h-full flex-1 bg-[#138808]"></div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
                    Smart Bharat System Rules
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Guideline prompt loaded dynamically from source.
                  </p>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-pointer"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl max-h-96 overflow-y-auto border border-slate-100 dark:border-zinc-900">
                <pre className="text-xs text-slate-600 dark:text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed">
                  {CIVIC_CHAT_PROMPT}
                </pre>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setShowInfoModal(false)}
                  type="button"
                  className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold shadow-sm transition-all dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
