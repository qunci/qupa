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
        <div className={`w-full px-6 transition-all duration-300 bg-white dark:bg-[#131314] ${isSidebarOpen ? 'h-0 opacity-0 pointer-events-none' : 'h-16 opacity-100'}`}>
          <div className="w-full h-full flex items-center">
            <WorkspaceSwitcher />
          </div>
        </div>

        {/* Tabs Bar / Tool Header */}
        <div className={`w-full px-6 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 bg-white dark:bg-[#131314] ${isSidebarOpen || activeTool ? 'h-16' : 'h-12'}`}>
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
                  <div className="shrink-0 flex items-center justify-center">
                    {activeTool === "image" ? (
                      <svg className="w-10 h-10 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.25">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.25">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-[17px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                      {activeTool === "image" ? t("imageConverter") : t("documentConverter")}
                    </h2>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-none">
                      {activeTool === "image" 
                        ? "Convert between JPG, PNG, WebP, SVG, and more effortlessly."
                        : "Convert PDF, DOCX, XLSX, and CSV with advanced layout retention."}
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-blue-500/20 ring-1 ring-blue-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">{t("imageConverter")}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Convert between JPG, PNG, WebP, SVG, and more effortlessly.</p>
                <button onClick={() => setActiveTool("image")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
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