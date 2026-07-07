"use client";

import { useState, useEffect } from "react";

interface Complaint {
  id: string;
  date: string;
  description: string;
  category: string;
  department: string;
  priority: "Low" | "Medium" | "High";
  summary: string;
  suggestedAction: string;
}

interface TriageResponse {
  category: string;
  department: string;
  priority: "Low" | "Medium" | "High";
  summary: string;
  suggestedAction: string;
}

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latestComplaint, setLatestComplaint] = useState<Complaint | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load complaints from localStorage safely on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smart_bharat_complaints");
      if (saved) {
        setComplaints(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load complaints from localStorage", e);
    }
  }, []);

  const cleanAndParseJson = (text: string): TriageResponse => {
    let cleaned = text.trim();
    
    // Handle markdown code blocks
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

  const handleReport = async (textToReport: string) => {
    if (!textToReport.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setLatestComplaint(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "issue",
          input: textToReport.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to connect to the Civic Triage server.");
      }

      const data = await response.json();
      const textOutput = data.text || "";

      let parsed: TriageResponse;
      try {
        parsed = cleanAndParseJson(textOutput);
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        throw new Error("The AI response was not formatted correctly. Please try again.");
      }

      // Generate a unique tracking ID like "SB-2026-1234"
      const currentYear = new Date().getFullYear(); // Will resolve to 2026 as per local time
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const trackingId = `SB-${currentYear}-${randomDigits}`;

      const newComplaint: Complaint = {
        id: trackingId,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        description: textToReport.trim(),
        category: parsed.category || "General",
        department: parsed.department || "Municipal Corporation",
        priority: parsed.priority || "Medium",
        summary: parsed.summary || "Civic complaint logged.",
        suggestedAction: parsed.suggestedAction || "Inspect and resolve the issue.",
      };

      // Save to state and localStorage
      const updatedComplaints = [newComplaint, ...complaints];
      setComplaints(updatedComplaints);
      localStorage.setItem("smart_bharat_complaints", JSON.stringify(updatedComplaints));
      setLatestComplaint(newComplaint);
      setDescription(""); // Clear form input
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during triaging.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleReport(description);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your complaint history?")) {
      setComplaints([]);
      localStorage.removeItem("smart_bharat_complaints");
      setLatestComplaint(null);
    }
  };

  // Helper to color priority badges
  const getPriorityStyles = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
      case "Low":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40";
      case "High":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
    }
  };

  const templates = [
    {
      label: "🕳️ Street Pothole",
      text: "There is a very deep pothole right in the middle of Mahatma Gandhi road near the main shopping square. It fills with rain water and causes severe bike accidents.",
    },
    {
      label: "💧 Water Pipeline Leak",
      text: "A drinking water main pipe line has burst on Lane 3 of Green Meadows society. Pure water is flooding the street and causing drainage blockage.",
    },
    {
      label: "💡 Streetlight Outage",
      text: "Entire lane of streetlights has been out for over a week at Sector 14 near the children's park, making the area pitch black and unsafe at night.",
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
              <span className="text-[#FF9933]">Report a</span>
              <span className="text-[#138808]">Civic Issue</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-1">
              File complaints directly, view automated triage, and monitor progress
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/schemes"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
            >
              🌾 Schemes
            </a>
            <a
              href="/chat"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
            >
              💬 Chat
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-8 z-0">
        {/* Form Panel */}
        <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 p-6 shadow-md transition-all">
          <h2 className="text-base font-semibold text-slate-800 dark:text-zinc-200 mb-2">
            Describe the civic problem
          </h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mb-4">
            Explain the issue in detail, specifying the location and current impacts. Our AI will automatically categorize, assign priority, and identify the responsible department.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              placeholder="Provide a description of the civic issue here..."
              className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:ring-orange-500/10 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 transition-all resize-y min-h-[100px]"
              required
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2">
                {templates.map((tpl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setDescription(tpl.text);
                      handleReport(tpl.text);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-medium transition-colors cursor-pointer"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !description.trim()}
                className={`px-6 py-3 rounded-2xl font-semibold text-xs tracking-wider uppercase transition-all shrink-0 ${
                  description.trim() && !isLoading
                    ? "bg-gradient-to-r from-[#FF9933] to-[#E65A28] text-white shadow-lg shadow-orange-500/10 hover:brightness-105 cursor-pointer"
                    : "bg-slate-100 text-slate-400 dark:bg-zinc-850 dark:text-zinc-700 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Triaging..." : "File Complaint"}
              </button>
            </div>
          </form>
        </section>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center py-10 gap-3 animate-pulse">
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-200 rounded-full border-t-orange-500 animate-spin"></div>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Analyzing issue details, category routing, and logging priority status...
            </p>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl dark:bg-red-950/20 dark:border-red-900/60">
            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
              Triage Error
            </h3>
            <p className="text-xs text-red-700 dark:text-red-400 mt-1">{error}</p>
          </div>
        )}

        {/* Registration Success and AI Card */}
        {latestComplaint && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
            {/* Confirmation Banner */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 flex items-center gap-3">
              <span className="text-lg">✅</span>
              <div className="text-xs">
                <span className="font-bold">Complaint registered:</span>{" "}
                <code className="bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded font-mono font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                  {latestComplaint.id}
                </code>
              </div>
            </div>

            {/* AI Triaging Results Card */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/80 mb-4 gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-base leading-tight">
                    Triage Analysis Summary
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                    Tracking ID: {latestComplaint.id} · Filed on {latestComplaint.date}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${getPriorityStyles(
                    latestComplaint.priority
                  )}`}
                >
                  {latestComplaint.priority} Priority
                </span>
              </div>

              <div className="space-y-4">
                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Assigned Category
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-300 text-xs font-semibold rounded-lg">
                      📁 {latestComplaint.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Responsible Department
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-300 text-xs font-semibold rounded-lg">
                      🏢 {latestComplaint.department}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                    Automated Summary
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-800/40">
                    {latestComplaint.summary}
                  </p>
                </div>

                {/* Suggested Action */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                    Suggested Action Plan
                  </h4>
                  <div className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed flex gap-2">
                    <span className="text-emerald-600 dark:text-emerald-500 text-sm">💡</span>
                    <span>{latestComplaint.suggestedAction}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Complaints History Panel */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800/60 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
              <span>My Complaints History</span>
              <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-full font-bold">
                {complaints.length}
              </span>
            </h2>
            {complaints.length > 0 && (
              <button
                onClick={handleClearHistory}
                type="button"
                className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 transition-colors cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          {complaints.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 p-8 text-center text-slate-400 dark:text-zinc-500">
              <span className="text-3xl block mb-2">📋</span>
              <p className="text-sm">You haven't submitted any complaints yet.</p>
              <p className="text-xs mt-1">Submit description to log details to dashboard.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-5 shadow-sm space-y-3 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800/60">
                    <div className="flex items-center gap-2.5">
                      <code className="text-xs bg-slate-100 dark:bg-zinc-850 px-2 py-0.5 rounded font-mono font-bold text-slate-800 dark:text-zinc-300">
                        {item.id}
                      </code>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                        Filed: {item.date}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto ${getPriorityStyles(
                        item.priority
                      )}`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">Description:</p>
                      <p className="text-xs text-slate-700 dark:text-zinc-300 line-clamp-2 italic">
                        "{item.description}"
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">Category</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{item.category}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">Department</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 truncate">{item.department}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">Triage Summary</p>
                      <p className="text-xs text-slate-800 dark:text-zinc-200">{item.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
