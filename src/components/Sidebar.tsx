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
    return `flex items-center text-sm font-medium rounded-full transition-all duration-300 ${
      isOpen ? "w-full gap-3 px-4 py-2.5" : "justify-center w-10 h-10 mx-auto"
    } ${
      isActive 
        ? "text-blue-700 bg-[#e8f0fe] dark:text-blue-300 dark:bg-blue-900/40" 
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5"
    }`;
  };

  return (
    <aside className={`bg-[#f0f4f9] dark:bg-[#1e1f20] flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out shrink-0 ${isOpen ? 'w-[260px]' : 'w-[68px]'}`}>
      
      {/* Brand Logo Header Area */}
      <div className={`h-16 flex items-center shrink-0 ${isOpen ? 'px-5 justify-between w-full' : 'px-0 justify-center'}`}>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
          <Link href="/" className="flex items-center gap-2 group select-none outline-none transition-opacity hover:opacity-80 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap">
            <BrandLogo className="h-6 w-auto drop-shadow-sm transition-transform duration-500 group-hover:scale-105 origin-left" />
            <span className="font-semibold text-[17px] text-slate-800 dark:text-slate-100 tracking-tight">Dashboard</span>
          </Link>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 shrink-0`}
          title={isOpen ? "Tutup sidebar" : "Buka sidebar"}
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v18M15 15l-3-3 3-3" />
            </svg>
          ) : (
            <BrandLogo className="w-8 h-8 drop-shadow-sm transition-transform duration-500 hover:scale-105" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-1 overflow-y-auto scrollbar-hide ${isOpen ? 'px-3 py-2' : 'py-4'}`}>
        {isOpen && (
          <p className="px-4 text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 mb-2 mt-1 transition-colors duration-300">
            {t("coreWorkspaces")}
          </p>
        )}
        {!isOpen && <div className="mt-4" />}

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
      <div className={`transition-colors duration-300 ${isOpen ? 'px-3 py-3' : 'py-4'}`}>
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
    <Suspense fallback={<div className="w-[260px] bg-[#f0f4f9] dark:bg-[#1e1f20] h-screen transition-colors duration-300 shrink-0" />}>
      <SidebarContent />
    </Suspense>
  );
}