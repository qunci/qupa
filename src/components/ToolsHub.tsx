"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

export default function ToolsHub() {
  const [activeTab, setActiveTab] = useState<"document" | "image">("document");
  const { t, isSidebarOpen } = useSettings();

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="w-full flex flex-col transition-colors duration-300">
        
        {/* Title Bar (Visible only when sidebar is closed) */}
        <div className={`w-full px-10 transition-all duration-300 overflow-hidden bg-white dark:bg-[#131314] ${isSidebarOpen ? 'h-0 opacity-0' : 'h-16 opacity-100'}`}>
          <div className="w-full max-w-7xl h-full flex items-center">
            <WorkspaceSwitcher />
          </div>
        </div>

        {/* Tabs Bar */}
        <div className={`w-full px-10 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 bg-white dark:bg-[#131314] ${isSidebarOpen ? 'h-16' : 'h-12'}`}>
          <div className="w-full max-w-7xl h-full">
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
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 p-10 w-full overflow-y-auto">
        <div className="w-full max-w-7xl">
          
          {activeTab === "document" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Merge PDF */}
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🗂️</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Merge PDF</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Combine multiple PDF files into one clean document sequence effortlessly.</p>
                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  Open Workspace
                </button>
              </div>

              {/* Card 2: Split PDF */}
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col transition-colors duration-300 shadow-sm">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">✂️</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Split PDF</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Extract specific pages or burst large PDF into single sheets.</p>
                <button disabled className="w-full py-2.5 bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 rounded-lg font-semibold cursor-not-allowed transition-colors border border-transparent dark:border-slate-700">
                  Coming Soon
                </button>
              </div>

            </div>
          )}

          {activeTab === "image" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Protect Image */}
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col transition-colors duration-300 shadow-sm">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4 text-slate-700 dark:text-slate-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Protect Image</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Encrypt image pixels or attach security locks directly in-browser.</p>
                <button disabled className="w-full py-2.5 bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 rounded-lg font-semibold cursor-not-allowed transition-colors border border-transparent dark:border-slate-700">
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