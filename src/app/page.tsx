"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ConverterHub = dynamic(() => import("@/components/ConverterHub"), { ssr: false });
const ToolsHub = dynamic(() => import("@/components/ToolsHub"), { ssr: false });
const SettingsHub = dynamic(() => import("@/components/SettingsHub"), { ssr: false });

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
    <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 w-full relative transition-colors duration-300">
      
      <header className="h-16 w-full bg-white dark:bg-slate-950 flex items-center justify-end px-10 shrink-0 sticky top-0 z-10 transition-colors duration-300">
      </header>

      {!hub ? <HeroLanding /> : hub === "tools" ? <ToolsHub /> : hub === "settings" ? <SettingsHub /> : <ConverterHub />}
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