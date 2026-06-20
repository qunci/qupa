"use client";

import { useState } from "react";
import ImageConverter from "./ImageConverter";
import DocumentConverter from "./DocumentConverter";
import { useSettings } from "@/hooks/useSettings";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

export default function ConverterHub() {
  const [activeTool, setActiveTool] = useState<"image" | "document" | null>(null);
  const { t, isSidebarOpen } = useSettings();

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="w-full flex flex-col transition-colors duration-300">
        
        {/* Title Bar (Visible only when sidebar is closed) */}
        <div className={`w-full px-6 transition-all duration-300 bg-white dark:bg-[#131314] ${isSidebarOpen ? 'h-0 opacity-0 pointer-events-none' : 'h-20 opacity-100'}`}>
          <div className="w-full h-full flex items-center">
            <WorkspaceSwitcher />
          </div>
        </div>

        {/* Tabs Bar / Tool Header */}
        <div className={`w-full px-6 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 bg-white dark:bg-[#131314] ${isSidebarOpen ? 'h-20' : (activeTool ? 'h-20' : 'h-14')}`}>
          <div className="w-full h-full flex items-center">
            {!activeTool ? (
              <nav className="flex space-x-6 overflow-x-auto no-scrollbar h-full">
                <button 
                  className={`h-full text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap border-blue-600 text-slate-900 dark:text-white`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  All Converters
                </button>
              </nav>
            ) : (
              <div className="flex items-center gap-4 w-full">
                <button onClick={() => setActiveTool(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {activeTool === "image" ? "🖼️" : "📄"}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                      {activeTool === "image" ? t("imageConverter") : t("documentConverter")}
                    </h2>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-none mt-1">
                      {activeTool === "image" ? "Convert between JPG, PNG, WebP, SVG, and more effortlessly." : "Convert PDF, DOCX, XLSX, and CSV with advanced layout retention."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 p-6 w-full overflow-y-auto">
        <div className="w-full">
          {activeTool === "image" && <ImageConverter />}
          {activeTool === "document" && <DocumentConverter />}

          {!activeTool && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">🖼️</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">{t("imageConverter")}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Convert between JPG, PNG, WebP, SVG, and more effortlessly.</p>
                <button onClick={() => setActiveTool("image")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">📄</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">{t("documentConverter")}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Convert PDF, DOCX, XLSX, and CSV with advanced layout retention.</p>
                <button onClick={() => setActiveTool("document")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}