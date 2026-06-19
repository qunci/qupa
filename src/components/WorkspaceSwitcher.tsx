"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSettings } from "@/hooks/useSettings";

function WorkspaceSwitcherContent() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentHub = searchParams.get("hub") || "converters";
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const workspaces = [
    { 
      id: "converters", 
      label: t("fileConverters"), 
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> 
    },
    { 
      id: "tools", 
      label: t("advancedTools"), 
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    }
  ];

  const currentWorkspace = workspaces.find(w => w.id === currentHub) || workspaces[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#1e1f20] px-2.5 py-1.5 -ml-2.5 rounded-lg transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <h1 className="text-[19px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {currentWorkspace.label}
        </h1>
        <div className={`w-5 h-5 flex items-center justify-center rounded bg-slate-200/60 dark:bg-[#1e1f20] group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#131314] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1">
            Workspaces
          </div>
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => {
                router.push(`/?hub=${ws.id}`);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${currentHub === ws.id ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              <div className={`flex items-center justify-center ${currentHub === ws.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {ws.icon}
              </div>
              <span className="font-semibold">{ws.label}</span>
              {currentHub === ws.id && (
                <svg className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkspaceSwitcher() {
  return (
    <Suspense fallback={<div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />}>
      <WorkspaceSwitcherContent />
    </Suspense>
  );
}
