"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSettings } from "@/hooks/useSettings";

function WorkspaceSwitcherContent() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentHub = searchParams.get("hub") || "dashboard";
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
      id: "dashboard", 
      label: t("dashboard"), 
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> 
    }
  ];

  const currentWorkspace = workspaces.find(w => w.id === currentHub) || workspaces[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#1e1f20] px-2.5 py-1.5 -ml-2.5 rounded-lg transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <h1 className="text-[17px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          {currentWorkspace.label}
        </h1>
        <div className={`w-4 h-4 flex items-center justify-center rounded bg-slate-200/60 dark:bg-[#1e1f20] group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <svg className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full -left-3 mt-1 w-56 bg-white dark:bg-[#131314] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
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
