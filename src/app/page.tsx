"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ConverterHub = dynamic(() => import("@/components/ConverterHub"), { ssr: false });
const ToolsHub = dynamic(() => import("@/components/ToolsHub"), { ssr: false });

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkThemeTimer = setTimeout(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    }, 0);
    return () => clearTimeout(checkThemeTimer);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isDark ? "bg-slate-700" : "bg-blue-100"
      }`}
    >
      <span
        className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow transition-transform duration-300 ${
          isDark ? "translate-x-8" : "translate-x-1"
        }`}
      >
        {isDark ? (
          <svg className="w-3.5 h-3.5 text-slate-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2m-7.07-15.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-13.66 5.66-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
        )}
      </span>
    </button>
  );
}

function HeroLanding() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 max-w-2xl mt-10 transition-colors duration-300">
        The Ultimate <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">Client-Side</span> Workspace.
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/?hub=converters" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
          Open File Converters
        </Link>
      </div>
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const hub = searchParams.get("hub");

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B1120] w-full relative transition-colors duration-300">
      
      {/* PERBAIKAN: border-b dan warna border dihapus di tag header ini */}
      <header className="h-16 w-full bg-white dark:bg-[#0B1120] flex items-center justify-end px-10 shrink-0 sticky top-0 z-10 transition-colors duration-300">
        <ThemeToggle />
      </header>

      {!hub ? <HeroLanding /> : hub === "tools" ? <ToolsHub /> : <ConverterHub />}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Matrix Environment...</div>}>
      <HomeContent />
    </Suspense>
  );
}