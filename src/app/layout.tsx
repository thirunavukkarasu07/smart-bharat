import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Bharat — AI-Powered Civic Companion",
  description: "Simplifying government services in Hindi, Tamil, and English.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        {/* Skip link for keyboard & screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#FF9933] focus:text-black focus:font-bold"
        >
          Skip to main content
        </a>
        {/* Sticky Global Top Navigation */}
        <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/80 shrink-0">
          {/* Indian flag tricolor top accent */}
          <div aria-hidden="true" className="h-1 w-full flex">
            <div className="h-full flex-1 bg-[#FF9933]"></div>
            <div className="h-full flex-1 bg-white"></div>
            <div className="h-full flex-1 bg-[#138808]"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-white hover:opacity-90 transition-all">
              <span className="bg-gradient-to-r from-[#FF9933] via-zinc-100 to-[#138808] bg-clip-text text-transparent font-extrabold text-base">Smart Bharat</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-medium">Companion</span>
            </Link>
            
            <nav aria-label="Primary navigation" className="flex items-center gap-5 sm:gap-6">
              <Link href="/" className="text-xs font-semibold text-zinc-400 hover:text-[#FF9933] transition-colors">Home</Link>
              <Link href="/chat" className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors">Chat</Link>
              <Link href="/schemes" className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors">Schemes</Link>
              <Link href="/report" className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors">Report</Link>
            </nav>
          </div>
        </header>

        {/* Dynamic page contents wrapper */}
        <main id="main-content" className="flex-1 flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="bg-zinc-950 border-t border-zinc-900/60 py-6 text-center text-xs text-zinc-500 shrink-0">
          <div className="max-w-6xl mx-auto px-6 font-medium">
            Built for Devengers PromptWars 2026 · Powered by Google Gemini
          </div>
        </footer>
      </body>
    </html>
  );
}

