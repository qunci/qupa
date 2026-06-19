"use client";

import { useSettings } from "@/hooks/useSettings";

export default function SettingsHub() {
  const { language, setLanguage, theme, setTheme, t, isSidebarOpen } = useSettings();

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="w-full flex flex-col transition-colors duration-300">
        
        {/* Title Bar (Visible only when sidebar is closed) */}
        <div className={`w-full px-10 transition-all duration-300 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131314] ${isSidebarOpen ? 'h-0 opacity-0 border-transparent' : 'h-16 opacity-100'}`}>
          <div className="w-full max-w-7xl h-full flex items-center">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 tracking-tight">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t("settingsTitle")}
          </h1>
        </div>
      </div>

      {/* WORKSPACE AREA */}
      <div className="flex-1 p-10 w-full overflow-y-auto">
        <div className="w-full max-w-2xl space-y-8">
          
          {/* Language Setting */}
          <div className="p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t("language")}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("languageDesc")}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${language === "en" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage("id")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${language === "id" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
              >
                Bahasa Indonesia
              </button>
            </div>
          </div>

          {/* Theme Setting */}
          <div className="p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t("theme")}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("themeDesc")}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setTheme("light")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${theme === "light" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2m-7.07-15.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-13.66 5.66-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
                {t("light")}
              </button>
              <button 
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${theme === "dark" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                {t("dark")}
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
