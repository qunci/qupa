"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useSettings } from "@/hooks/useSettings";

function SidebarContent() {
  const searchParams = useSearchParams();
  const currentHub = searchParams.get("hub") || "dashboard";
  const { t, isSidebarOpen: isOpen, setIsSidebarOpen: setIsOpen, recentTools } = useSettings();
  const [isRecentOpen, setIsRecentOpen] = useState(true);

  const getToolTitle = (toolId: string) => {
    switch (toolId) {
      case "merge-pdf": return "Merge PDF";
      case "split-pdf": return "Split PDF";
      case "compress-file": return t("compressFile");
      case "extract-archive": return t("extractArchive");
      case "encrypt-file": return t("encryptFile");
      case "decrypt-file": return t("decryptFile");
      case "convert-image": return t("imageConverter");
      case "convert-document": return t("documentConverter");
      case "compress-image": return "Image Compressor";
      default: return toolId;
    }
  };

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
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside className={`bg-[#f0f4f9]/90 dark:bg-[#1e1f20]/90 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col h-screen fixed md:sticky top-0 transition-transform md:transition-all duration-300 ease-in-out shrink-0 z-50 ${isOpen ? 'w-[280px] md:w-[260px] translate-x-0' : 'w-[280px] md:w-[68px] -translate-x-full md:translate-x-0'}`}>
      
      {/* Brand Logo Header Area */}
      <div className={`h-16 flex items-center shrink-0 ${isOpen ? 'px-5 justify-between w-full' : 'px-0 justify-center'}`}>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
          <Link href="/" className="flex items-center gap-2 group select-none outline-none transition-opacity hover:opacity-80 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap">
            <BrandLogo className="h-6 w-auto drop-shadow-sm transition-transform duration-500 group-hover:scale-105 origin-left" />
            <span className="font-semibold text-[17px] text-slate-800 dark:text-slate-100 tracking-tight">Qupa</span>
          </Link>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`group p-2 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 shrink-0 md:flex ${isOpen ? 'flex' : 'hidden'}`}
          title={isOpen ? "Tutup sidebar" : "Buka sidebar"}
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v18" />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 15l-3-3 3-3" 
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
              />
            </svg>
          ) : (
            <BrandLogo className="w-[22px] h-[22px] drop-shadow-sm transition-transform duration-500 hover:scale-105" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-1 overflow-y-auto scrollbar-hide px-3 py-2`}>
        {isOpen && (
          <p className="px-4 text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 mb-2 mt-1 transition-colors duration-300 uppercase">
            {t("coreWorkspaces")}
          </p>
        )}

        <Link href="/?hub=dashboard" onClick={() => { if (window.innerWidth < 768) setIsOpen(false); }} className={getMenuClass("dashboard")} title={!isOpen ? t("dashboard") : undefined}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {isOpen && <span>{t("dashboard")}</span>}
        </Link>

        {/* Recent Tools Section */}
        {recentTools.length > 0 && isOpen && (
          <div className="mt-6">
            <button 
              onClick={() => setIsRecentOpen(!isRecentOpen)}
              className="w-full flex items-center justify-between px-4 py-1.5 text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
            >
              <span className="uppercase">{t("recentTools")}</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isRecentOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            <div className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-300 ${isRecentOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
              {recentTools.map(tool => (
                <Link 
                  key={tool}
                  href={`/?hub=dashboard&tool=${tool}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 rounded-full transition-colors"
                  title={getToolTitle(tool)}
                >
                  <svg className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="truncate">{getToolTitle(tool)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Settings */}
      <div className={`transition-colors duration-300 ${isOpen ? 'px-3 py-3' : 'py-4'}`}>
        <Link href="/?hub=settings" onClick={() => { if (window.innerWidth < 768) setIsOpen(false); }} className={getMenuClass("settings")} title={!isOpen ? t("settings") : undefined}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isOpen && <span>{t("settings")}</span>}
        </Link>
      </div>
    </aside>
    </>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="hidden md:block w-[260px] bg-[#f0f4f9]/80 dark:bg-[#1e1f20]/80 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 h-screen transition-colors duration-300 shrink-0" />}>
      <SidebarContent />
    </Suspense>
  );
}