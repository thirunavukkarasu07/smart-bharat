"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-950 font-sans text-zinc-100 relative overflow-hidden px-6 py-16">
      {/* Decorative blurred backgrounds representing the Tricolor */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Content */}
      <div className="max-w-4xl w-full text-center space-y-8 z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-[#FF9933] animate-pulse"></span>
            Civic Portal Dashboard
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-[#FF9933] via-zinc-100 to-[#138808] bg-clip-text text-transparent">
              Smart Bharat
            </span>
            <span className="block text-xl sm:text-2xl mt-3 font-medium text-zinc-400">
              AI-Powered Civic Companion
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Government services, made simple — in your language
          </p>
          
          <p className="text-sm font-semibold tracking-wider text-zinc-500">
            🇮🇳 हिंदी · தமிழ் · English
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/chat"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF9933] to-[#E65A28] text-white font-bold text-sm tracking-wider uppercase hover:brightness-105 transition-all shadow-lg shadow-orange-500/20"
          >
            Start Chatting
          </Link>
          <Link
            href="/schemes"
            className="px-8 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-white font-bold text-sm tracking-wider uppercase transition-all"
          >
            Find Schemes
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          {/* Card 1: Chat */}
          <Link
            href="/chat"
            className="group bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl hover:border-[#FF9933]/50 hover:bg-zinc-900 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF9933]/10 border border-[#FF9933]/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                💬
              </div>
              <h3 className="font-bold text-lg text-zinc-100 group-hover:text-[#FF9933] transition-colors">
                Civic AI Chat
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                Conversational civic queries in English, Hindi, and Tamil.
              </p>
            </div>
            <div className="mt-6 text-xs font-bold text-[#FF9933] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Ask now <span>→</span>
            </div>
          </Link>

          {/* Card 2: Schemes */}
          <Link
            href="/schemes"
            className="group bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl hover:border-zinc-300/30 hover:bg-zinc-900 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🔍
              </div>
              <h3 className="font-bold text-lg text-zinc-100 group-hover:text-zinc-200 transition-colors">
                Scheme Finder
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                Locate eligibility guidelines and check lists for schemes.
              </p>
            </div>
            <div className="mt-6 text-xs font-bold text-zinc-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Find schemes <span>→</span>
            </div>
          </Link>

          {/* Card 3: Report */}
          <Link
            href="/report"
            className="group bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl hover:border-[#138808]/50 hover:bg-zinc-900 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#138808]/10 border border-[#138808]/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                ⚠️
              </div>
              <h3 className="font-bold text-lg text-zinc-100 group-hover:text-[#138808] transition-colors">
                Issue Triage
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                Report problems to municipal departments and track status.
              </p>
            </div>
            <div className="mt-6 text-xs font-bold text-[#138808] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Report issue <span>→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
