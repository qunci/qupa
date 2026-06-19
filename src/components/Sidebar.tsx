"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useSettings } from "@/hooks/useSettings";

function SidebarContent() {
  const searchParams = useSearchParams();
  const currentHub = searchParams.get("hub") || "converters";
  const { t } = useSettings();
  const [isOpen, setIsOpen] = useState(true);

  const getMenuClass = (hubName: string) => {
    const isActive = currentHub === hubName;
    return `flex items-center p-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
      isOpen ? "w-full gap-3" : "justify-center w-12 h-12 mx-auto"
    } ${
      isActive 
        ? "text-blue-700 bg-blue-50/80 shadow-sm border border-blue-100/50 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800/30" 
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
    }`;
  };

  return (
    <aside className={`bg-white dark:bg-slate-950 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out shrink-0 ${isOpen ? 'w-64' : 'w-20'}`}>
      
      {/* Brand Logo Header Area */}
      <div className={`h-20 flex items-center shrink-0 ${isOpen ? 'px-6 justify-between w-full' : 'px-0 justify-center'}`}>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
          <Link href="/" className="flex items-center gap-3 group select-none outline-none transition-opacity hover:opacity-80 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap">
            <BrandLogo className="h-8 w-auto drop-shadow-sm transition-transform duration-500 group-hover:scale-105 origin-left" />
            <span className="font-bold text-lg text-slate-900 dark:text-white">Dashboard</span>
          </Link>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 shrink-0`}
          title={isOpen ? "Tutup sidebar" : "Buka sidebar"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-2 overflow-y-auto ${isOpen ? 'p-4' : 'py-4'}`}>
        {isOpen && (
          <p className="px-3 text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4 mt-2 transition-colors duration-300">
            {t("coreWorkspaces")}
          </p>
        )}
        {!isOpen && <div className="mt-8" />}

        <Link href="/?hub=converters" className={getMenuClass("converters")} title={!isOpen ? t("fileConverters") : undefined}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {isOpen && <span>{t("fileConverters")}</span>}
        </Link>

        <Link href="/?hub=tools" className={getMenuClass("tools")} title={!isOpen ? t("advancedTools") : undefined}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isOpen && <span>{t("advancedTools")}</span>}
        </Link>
      </nav>

      {/* Settings */}
      <div className={`border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 ${isOpen ? 'p-4' : 'py-4'}`}>
        <Link href="/?hub=settings" className={getMenuClass("settings")} title={!isOpen ? t("settings") : undefined}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isOpen && <span>{t("settings")}</span>}
        </Link>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 bg-white dark:bg-slate-950 h-screen transition-colors duration-300 shrink-0" />}>
      <SidebarContent />
    </Suspense>
  );
}