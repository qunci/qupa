"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import MobileHeaderToggle from "./MobileHeaderToggle";
import MergePdfTool from "./MergePdfTool";
import SplitPdfTool from "./SplitPdfTool";
import ImageCompressorTool from "./ImageCompressorTool";
import ImageConverter from "./ImageConverter";
import DocumentConverter from "./DocumentConverter";

type ToolId = "merge-pdf" | "split-pdf" | "compress-image" | "image" | "document";

interface ToolMeta {
  id: ToolId;
  title: string;
  desc: string;
  icon: React.ReactNode;
  colorClass: string;
}

export default function DashboardHub() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const { t, isSidebarOpen, pinnedTools, togglePinTool } = useSettings();

  const ALL_TOOLS: Record<ToolId, ToolMeta> = {
    "image": {
      id: "image",
      title: t("imageConverter"),
      desc: "Convert between JPG, PNG, WebP, SVG, and more effortlessly.",
      colorClass: "from-blue-400 to-blue-600 shadow-blue-500/20 ring-blue-500/30",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    "document": {
      id: "document",
      title: t("documentConverter"),
      desc: "Convert PDF, DOCX, XLSX, and CSV with advanced layout retention.",
      colorClass: "from-indigo-400 to-indigo-600 shadow-indigo-500/20 ring-indigo-500/30",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    "merge-pdf": {
      id: "merge-pdf",
      title: "Merge PDF",
      desc: "Combine multiple PDF files into one clean document sequence effortlessly.",
      colorClass: "from-amber-400 to-orange-500 shadow-orange-500/20 ring-orange-500/30",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      )
    },
    "split-pdf": {
      id: "split-pdf",
      title: "Split PDF",
      desc: "Extract specific pages or burst large PDF into single sheets.",
      colorClass: "from-rose-400 to-red-500 shadow-red-500/20 ring-red-500/30",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      )
    },
    "compress-image": {
      id: "compress-image",
      title: "Image Compressor",
      desc: "Compress JPG, WebP, and PNG sizes while maintaining stunning visual quality.",
      colorClass: "from-emerald-400 to-teal-500 shadow-teal-500/20 ring-teal-500/30",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  };

  const getActiveToolMeta = () => activeTool ? ALL_TOOLS[activeTool] : null;

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="w-full flex flex-col transition-colors duration-300">
        <div className={`w-full px-4 md:px-6 transition-all duration-300 bg-white/80 dark:bg-[#131314]/80 backdrop-blur-xl sticky top-0 z-20 flex items-center h-16 ${isSidebarOpen ? 'md:h-0 md:opacity-0 md:pointer-events-none' : ''}`}>
          <MobileHeaderToggle />
          <div className="w-full h-full flex items-center">
            <WorkspaceSwitcher />
          </div>
        </div>

        <div className={`w-full px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 bg-white dark:bg-[#131314] ${activeTool ? 'h-16' : (isSidebarOpen ? 'h-12 md:h-16' : 'h-12')}`}>
          <div className="w-full h-full flex items-center">
            {!activeTool ? (
              <div className="flex items-center w-full">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {t("dashboard")}
                </h1>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveTool(null)}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md bg-gradient-to-br flex items-center justify-center shrink-0 ${getActiveToolMeta()?.colorClass.replace('shadow-', 'shadow-sm shadow-').replace('ring-', 'ring-1 ring-')}`}>
                      {getActiveToolMeta()?.icon}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h2 className="text-[15px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                        {getActiveToolMeta()?.title}
                      </h2>
                    </div>
                  </div>
                </div>
                
                {/* Pin button inside tool view */}
                <button
                  onClick={() => togglePinTool(activeTool)}
                  title={pinnedTools.includes(activeTool) ? t("unpinTool") : t("pinTool")}
                  className={`p-2 rounded-lg transition-colors ${pinnedTools.includes(activeTool) ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <svg className="w-5 h-5" fill={pinnedTools.includes(activeTool) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 w-full overflow-y-auto">
        <div className="w-full">
          
          {activeTool === "merge-pdf" && <MergePdfTool />}
          {activeTool === "split-pdf" && <SplitPdfTool />}
          {activeTool === "compress-image" && <ImageCompressorTool />}
          {activeTool === "image" && <ImageConverter />}
          {activeTool === "document" && <DocumentConverter />}

          {!activeTool && (
            <div className="w-full space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 px-1 uppercase tracking-wider">{t("pinnedTools")}</h3>
                
                {pinnedTools.length === 0 ? (
                  <div className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 border-dashed dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">No Pinned Tools</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{t("noPinnedTools")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {pinnedTools.map((toolId) => {
                      const tool = ALL_TOOLS[toolId as ToolId];
                      if (!tool) return null;
                      
                      return (
                        <div key={tool.id} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md relative group">
                          
                          <button
                            onClick={(e) => { e.stopPropagation(); togglePinTool(tool.id); }}
                            className="absolute top-4 right-4 p-1.5 rounded-md text-amber-500 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-amber-500/10"
                            title={t("unpinTool")}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                          </button>

                          <div className={`w-10 h-10 bg-gradient-to-br ${tool.colorClass} rounded-lg flex items-center justify-center mb-3 ring-1`}>
                            {tool.icon}
                          </div>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5 pr-6">{tool.title}</h3>
                          <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">{tool.desc}</p>
                          <button onClick={() => setActiveTool(tool.id)} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                            Open Workspace
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
