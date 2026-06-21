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
      
      <header className="absolute top-0 right-0 w-full h-16 flex items-center justify-end px-4 md:px-6 z-30 pointer-events-none gap-2.5">
        <div className="pointer-events-auto hidden md:flex">
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-2.5 h-[26px] bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full text-[12px] font-medium transition-colors border-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <div className="flex items-center gap-0.5 opacity-70 ml-0.5">
              <kbd className="font-sans text-[9px] font-bold bg-white dark:bg-slate-950 px-1 py-0.5 rounded text-slate-500 dark:text-slate-400">⌘</kbd>
              <kbd className="font-sans text-[9px] font-bold bg-white dark:bg-slate-950 px-1 py-0.5 rounded text-slate-500 dark:text-slate-400">K</kbd>
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