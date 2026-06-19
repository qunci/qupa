"use client";

import { useState } from "react";
import ImageConverter from "./ImageConverter";
import DocumentConverter from "./DocumentConverter";
import { useSettings } from "@/hooks/useSettings";

export default function ConverterHub() {
  const [activeTab, setActiveTab] = useState<"image" | "document">("image");
  const { t } = useSettings();

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
      
      {/* Header Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 px-10 w-full transition-colors duration-300">
        <div className="w-full max-w-7xl">
          <nav className="flex space-x-8 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab("image")}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "image" ? "border-blue-600 text-slate-900 dark:text-white" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {t("imageConverter")}
            </button>
            <button 
              onClick={() => setActiveTab("document")}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "document" ? "border-blue-600 text-slate-900 dark:text-white" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              {t("documentConverter")}
            </button>
          </nav>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 p-10 w-full overflow-y-auto">
        <div className="w-full max-w-7xl">
          {activeTab === "image" ? <ImageConverter /> : <DocumentConverter />}
        </div>
      </div>

    </div>
  );
}