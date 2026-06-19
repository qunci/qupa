"use client";

import { useSettings } from "@/hooks/useSettings";

export default function SettingsHub() {
  const { language, setLanguage, theme, setTheme, t, isSidebarOpen } = useSettings();

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="w-full flex flex-col transition-colors duration-300">
        
        {/* Title Bar */}
        <div className="w-full px-10 transition-all duration-300 bg-white dark:bg-[#131314] h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="w-full max-w-7xl h-full flex items-center">
            <h1 className="text-[19px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
              {t("settingsTitle")}
            </h1>
          </div>
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
