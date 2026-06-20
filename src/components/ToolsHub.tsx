"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import MergePdfTool from "./MergePdfTool";
import SplitPdfTool from "./SplitPdfTool";

export default function ToolsHub() {
  const [activeTab, setActiveTab] = useState<"document" | "image">("document");
  const [activeTool, setActiveTool] = useState<"merge-pdf" | "split-pdf" | null>(null);
  const { isSidebarOpen } = useSettings();

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="w-full flex flex-col transition-colors duration-300">
        
        {/* Title Bar (Visible only when sidebar is closed) */}
        <div className={`w-full px-10 transition-all duration-300 bg-white dark:bg-[#131314] ${isSidebarOpen ? 'h-0 opacity-0 pointer-events-none' : 'h-16 opacity-100'}`}>
          <div className="w-full max-w-7xl h-full flex items-center">
            <WorkspaceSwitcher />
          </div>
        </div>

        <div className={`w-full px-10 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 bg-white dark:bg-[#131314] ${isSidebarOpen || activeTool ? 'h-16' : 'h-12'}`}>
          <div className="w-full max-w-7xl h-full flex items-center">
            {!activeTool ? (
              <nav className="flex space-x-6 overflow-x-auto no-scrollbar h-full">
                <button 
                  onClick={() => setActiveTab("document")}
                  className={`h-full text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "document" ? "border-blue-600 text-slate-900 dark:text-white" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  Document Tools
                </button>
                <button 
                  onClick={() => setActiveTab("image")}
                  className={`h-full text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "image" ? "border-blue-600 text-slate-900 dark:text-white" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Image Tools
                </button>
              </nav>
            ) : (
              <div className="flex items-center gap-4 w-full">
                <button onClick={() => setActiveTool(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {activeTool === "merge-pdf" ? "🗂️" : "✂️"}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                      {activeTool === "merge-pdf" ? "Merge PDF" : "Split PDF"}
                    </h2>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-none mt-1">
                      {activeTool === "merge-pdf" ? "Combine multiple PDF files into one clean document sequence effortlessly." : "Extract pages or burst documents into individual files."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 w-full overflow-y-auto">
        <div className="w-full max-w-7xl">
          
          {activeTool === "merge-pdf" && <MergePdfTool />}
          {activeTool === "split-pdf" && <SplitPdfTool />}

          {!activeTool && activeTab === "document" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">🗂️</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">Merge PDF</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Combine multiple PDF files into one clean document sequence effortlessly.</p>
                <button onClick={() => setActiveTool("merge-pdf")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">✂️</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">Split PDF</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Extract specific pages or burst large PDF into single sheets.</p>
                <button onClick={() => setActiveTool("split-pdf")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

            </div>
          )}

          {!activeTool && activeTab === "image" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-3 text-slate-700 dark:text-slate-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">Protect Image</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Encrypt image pixels or attach security locks directly in-browser.</p>
                <button disabled className="w-full py-1.5 text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 rounded-md font-medium cursor-not-allowed transition-colors border border-transparent dark:border-slate-700">
                  Coming Soon
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}