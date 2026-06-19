"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSettings } from "@/hooks/useSettings";

function SidebarContent() {
  const searchParams = useSearchParams();
  const currentHub = searchParams.get("hub") || "converters";
  const { t } = useSettings();

  const getMenuClass = (hubName: string) => {
    const isActive = currentHub === hubName;
    return `w-full flex items-center gap-3 p-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
      isActive 
        ? "text-blue-700 bg-blue-50/80 shadow-sm border border-blue-100/50 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800/30" 
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
    }`;
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#0B1120] flex flex-col h-screen sticky top-0 transition-colors duration-300 shrink-0">
      
      {/* Brand Logo */}
      <Link href="/" className="h-20 flex items-center px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300 group select-none shrink-0">
        <svg viewBox="130 50 420 300" className="h-9 w-auto drop-shadow-sm transition-transform duration-500 group-hover:scale-105 origin-left" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="qGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
            <mask id="tail-gap">
              <rect width="800" height="400" fill="white" />
              <circle cx="220" cy="200" r="82" fill="black" />
            </mask>
          </defs>
          <circle cx="220" cy="200" r="60" fill="none" stroke="url(#qGrad)" strokeWidth="30" />
          <polygon points="270,195 330,275 230,275" fill="url(#qGrad)" mask="url(#tail-gap)" />
          <text x="310 390 470" y="200" fontFamily="Montserrat, Inter, 'Arial Black', sans-serif" fontWeight="900" fontSize="110" className="fill-slate-900 dark:fill-white" dominantBaseline="central">upa</text>
        </svg>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4 mt-2 transition-colors duration-300">
          {t("coreWorkspaces")}
        </p>

        <Link href="/?hub=converters" className={getMenuClass("converters")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>{t("fileConverters")}</span>
        </Link>

        <Link href="/?hub=tools" className={getMenuClass("tools")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{t("advancedTools")}</span>
        </Link>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <Link href="/?hub=settings" className={getMenuClass("settings")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{t("settings")}</span>
        </Link>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 bg-white dark:bg-[#0B1120] h-screen transition-colors duration-300 shrink-0" />}>
      <SidebarContent />
    </Suspense>
  );
}