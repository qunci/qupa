"use client";

import { useSettings } from "@/hooks/useSettings";

export default function MobileHeaderToggle() {
  const { setIsSidebarOpen } = useSettings();
  
  return (
    <button 
      onClick={() => setIsSidebarOpen(true)}
      className="md:hidden p-2 -ml-2 -mr-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="Open sidebar"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
