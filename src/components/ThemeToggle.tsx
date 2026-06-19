"use client";

import { useSettings } from "@/hooks/useSettings";

export default function ThemeToggle() {
  const { theme, setTheme } = useSettings();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-[26px] w-[50px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      title={isDark ? "Beralih ke Terang" : "Beralih ke Gelap"}
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Icons in the track (always visible, underneath the thumb) */}
      <div className="absolute inset-0 flex w-full justify-between items-center px-1.5 pointer-events-none">
        <svg className="h-[14px] w-[14px] text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg className="h-[13px] w-[13px] text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>

      {/* The thumb that slides */}
      <span
        className={`pointer-events-none relative inline-block h-[18px] w-[18px] rounded-full bg-white dark:bg-slate-950 shadow-sm ring-0 transition-transform duration-300 ease-in-out z-10 flex items-center justify-center ${
          isDark ? "translate-x-[24px]" : "translate-x-0.5"
        }`}
      >
      </span>
    </button>
  );
}
