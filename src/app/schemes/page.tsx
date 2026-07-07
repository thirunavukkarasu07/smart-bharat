"use client";

import { useState } from "react";

interface Scheme {
  name: string;
  why: string;
  benefit: string;
  documents: string[];
  applyAt: string;
}

interface SchemeResponse {
  schemes: Scheme[];
  note: string;
}

export default function SchemesPage() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SchemeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const cleanAndParseJson = (text: string): SchemeResponse => {
    let cleaned = text.trim();
    
    // Handle markdown code blocks if present
    if (cleaned.includes("```json")) {
      const match = cleaned.match(/```json([\s\S]*?)```/);
      if (match && match[1]) {
        cleaned = match[1].trim();
      }
    } else if (cleaned.includes("```")) {
      const match = cleaned.match(/```([\s\S]*?)```/);
      if (match && match[1]) {
        cleaned = match[1].trim();
      }
    }

    return JSON.parse(cleaned);
  };

  const handleSearch = async (textToSearch: string) => {
    if (!textToSearch.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setRawText(null);
    setShowRaw(false);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "scheme",
          input: textToSearch.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to connect to the Scheme database server.");
      }

      const data = await response.json();
      const textOutput = data.text || "";
      setRawText(textOutput);

      try {
        const parsed = cleanAndParseJson(textOutput);
        setResult(parsed);
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        throw new Error(
          "The AI returned scheme data in an unexpected format. You can click 'View Raw Data' below to inspect the response."
        );
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(description);
  };

  const sampleScenarios = [
    {
      label: "🌾 Punjab Farmer",
      text: "I am a 45-year-old farmer from Punjab. Family income is 1.5 lakhs. I have 2 school-going daughters and want to see what agriculture and education benefits we have.",
    },
    {
      label: "👵 Pension & Medical",
      text: "I am a 65-year-old retired widow living in Tamil Nadu with no regular pension. I need support for medical expenses and elderly assistance.",
    },
    {
      label: "🎓 Student Scholarship",
      text: "I am a 19-year-old engineering student from Maharashtra. My family's annual income is 2.2 lakhs. I need to find college scholarships.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans relative overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-200/10 rounded-full blur-3xl pointer-events-none dark:bg-orange-950/5"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-200/10 rounded-full blur-3xl pointer-events-none dark:bg-emerald-950/5"></div>

      {/* Flag stripe at top */}
      <div className="h-1.5 w-full flex shrink-0">
        <div className="h-full flex-1 bg-[#FF9933]"></div>
        <div className="h-full flex-1 bg-white"></div>
        <div className="h-full flex-1 bg-[#138808]"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 dark:bg-zinc-900/80 dark:border-zinc-800/60 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              <span className="text-[#FF9933]">Scheme</span>
              <span className="text-slate-400 dark:text-zinc-600 font-light">&</span>
              <span className="text-[#138808]">Document Finder</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Personalized central and state benefit matching for Indian citizens
            </p>
          </div>
          <a
            href="/chat"
            className="self-start md:self-auto text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
          >
            💬 Back to Civic Chat
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8 z-0">
        {/* Input Card */}
        <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 p-6 shadow-md transition-all">
          <h2 className="text-base font-semibold text-slate-800 dark:text-zinc-200 mb-2">
            Describe your profile and needs
          </h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mb-4">
            Include details like your age, state of residence, occupation, income level, or specific requirements to get matching results.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              placeholder="E.g., I am a 32 year old woman from Karnataka running a tailoring business. My household income is 1.2 lakhs per year..."
              className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:ring-orange-500/10 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 transition-all resize-y min-h-[100px]"
              required
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2">
                {sampleScenarios.map((scenario, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setDescription(scenario.text);
                      handleSearch(scenario.text);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-medium transition-colors cursor-pointer"
                  >
                    {scenario.label}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !description.trim()}
                className={`px-6 py-3 rounded-2xl font-semibold text-xs tracking-wider uppercase transition-all shrink-0 ${
                  description.trim() && !isLoading
                    ? "bg-gradient-to-r from-[#FF9933] to-[#E65A28] text-white shadow-lg shadow-orange-500/10 hover:brightness-105 cursor-pointer"
                    : "bg-slate-100 text-slate-400 dark:bg-zinc-850 dark:text-zinc-700 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Searching..." : "Find Schemes"}
              </button>
            </div>
          </form>
        </section>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-6">
            <div className="h-6 w-48 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-6 space-y-4 shadow-sm animate-pulse"
                >
                  <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-5/6"></div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl dark:bg-red-950/20 dark:border-red-900/60">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
                  Search Failed
                </h3>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">{error}</p>
              </div>
              {rawText && (
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  type="button"
                  className="text-xs font-semibold underline text-red-800 hover:text-red-900 dark:text-red-400 cursor-pointer"
                >
                  {showRaw ? "Hide Raw Data" : "View Raw Data"}
                </button>
              )}
            </div>

            {showRaw && rawText && (
              <div className="mt-3 bg-zinc-900 text-zinc-300 p-3 rounded-xl overflow-x-auto text-[10px] font-mono whitespace-pre-wrap max-h-60 border border-zinc-800">
                {rawText}
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
                Matching Schemes Found ({result.schemes.length})
              </h2>
            </div>

            {/* Schemes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.schemes.map((scheme, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-slate-800 dark:text-zinc-200 leading-tight">
                        {scheme.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-full shrink-0">
                        Eligible
                      </span>
                    </div>

                    {/* Eligibility Why */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                        Why You Qualify
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-zinc-300">{scheme.why}</p>
                    </div>

                    {/* Benefit */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                        Benefits Provided
                      </h4>
                      <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/40 p-3 rounded-xl text-sm font-medium text-[#138808] dark:text-emerald-400">
                        {scheme.benefit}
                      </div>
                    </div>

                    {/* Document Checklist */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1.5">
                        Required Documents Checklist
                      </h4>
                      <ul className="space-y-1.5">
                        {scheme.documents.map((doc, docIdx) => (
                          <li
                            key={docIdx}
                            className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-zinc-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Apply details */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                      How to Apply:
                    </span>
                    <span className="text-xs font-semibold px-3 py-1.5 bg-[#FF9933]/10 dark:bg-orange-500/10 text-[#FF9933] dark:text-orange-400 rounded-lg text-right max-w-[70%] truncate">
                      {scheme.applyAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Caution Disclaimer */}
            {result.note && (
              <div className="bg-amber-50 border-l-4 border-[#FF9933] p-4 rounded-2xl flex gap-3 text-amber-900 dark:bg-amber-950/20 dark:border-[#FF9933] dark:text-amber-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <div className="text-xs">
                  <span className="font-bold">Caveat Checklist Note:</span> {result.note}
                  <div className="mt-1 font-semibold opacity-75">
                    ⚠️ Please verify current scheme terms, amounts, and portals on official government sites.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
