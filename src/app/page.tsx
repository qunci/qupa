"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import ThemeToggle from "@/components/ThemeToggle";
import { Search } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

const ToolsHub = dynamic(() => import("@/components/ToolsHub"), { ssr: false });
const SettingsHub = dynamic(() => import("@/components/SettingsHub"), { ssr: false });


function HomeContent() {
  const searchParams = useSearchParams();
  const hub = searchParams.get("hub") || "dashboard";

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("open-global-search"));
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen w-full relative transition-colors duration-300">
      
      <header className="absolute top-0 right-0 w-full h-16 flex items-center justify-end px-4 md:px-6 z-30 pointer-events-none gap-3">
        <div className="pointer-events-auto hidden md:flex">
          <button
            onClick={openSearch}
            className="flex items-center gap-3 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 rounded-full text-sm font-medium transition-colors ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-sm backdrop-blur-md"
          >
            <Search className="w-4 h-4" />
            <span>Search tools...</span>
            <div className="flex items-center gap-0.5 opacity-60">
              <kbd className="font-sans text-[10px] font-bold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">⌘</kbd>
              <kbd className="font-sans text-[10px] font-bold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">K</kbd>
            </div>
          </button>
        </div>
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {hub === "settings" ? (
          <motion.div key="settings" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="w-full h-full flex flex-col">
            <SettingsHub />
          </motion.div>
        ) : (
          <motion.div key="tools" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="w-full h-full flex flex-col">
            <ToolsHub />
          </motion.div>
        )}
      </AnimatePresence>
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