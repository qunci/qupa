"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import ThemeToggle from "@/components/ThemeToggle";

import { AnimatePresence, motion } from "framer-motion";

const DashboardHub = dynamic(() => import("@/components/DashboardHub"), { ssr: false });
const ConverterHub = dynamic(() => import("@/components/ConverterHub"), { ssr: false });
const ToolsHub = dynamic(() => import("@/components/ToolsHub"), { ssr: false });
const SettingsHub = dynamic(() => import("@/components/SettingsHub"), { ssr: false });


function HomeContent() {
  const searchParams = useSearchParams();
  const hub = searchParams.get("hub") || "dashboard";

  return (
    <main className="flex-1 flex flex-col min-h-screen w-full relative transition-colors duration-300">
      
      <header className="absolute top-0 right-0 w-full h-16 flex items-center justify-end px-4 md:px-6 z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {hub === "tools" ? (
          <motion.div key="tools" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="w-full h-full flex flex-col">
            <ToolsHub />
          </motion.div>
        ) : hub === "settings" ? (
          <motion.div key="settings" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="w-full h-full flex flex-col">
            <SettingsHub />
          </motion.div>
        ) : hub === "converters" ? (
          <motion.div key="converters" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="w-full h-full flex flex-col">
            <ConverterHub />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="w-full h-full flex flex-col">
            <DashboardHub />
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