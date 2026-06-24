"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSettings } from "@/hooks/useSettings";
import { Search } from "lucide-react";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import MobileHeaderToggle from "./MobileHeaderToggle";
import MergePdfTool from "./MergePdfTool";
import SplitPdfTool from "./SplitPdfTool";
import ImageCompressorTool from "./ImageCompressorTool";
import ArchiveTool from "./ArchiveTool";
import FileEncryptionTool from "./FileEncryptionTool";
import ImageConverter from "./ImageConverter";
import DocumentConverter from "./DocumentConverter";

export default function ToolsHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTool = searchParams.get("tool");

  const [activeTab, setActiveTab] = useState<"document" | "image" | "file">("document");
  const [activeTool, setActiveToolState] = useState<"merge-pdf" | "split-pdf" | "compress-image" | "compress-file" | "extract-archive" | "encrypt-file" | "decrypt-file" | "convert-image" | "convert-document" | null>(null);
  const { isSidebarOpen, t, addRecentTool } = useSettings();

  useEffect(() => {
    if (urlTool) {
      setActiveToolState(urlTool as any);
      addRecentTool(urlTool);
    } else {
      setActiveToolState(null);
    }
  }, [urlTool, addRecentTool]);

  const setActiveTool = (tool: string | null) => {
    if (tool) {
      router.push(`/?hub=dashboard&tool=${tool}`);
    } else {
      router.push(`/?hub=dashboard`);
    }
  };

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("open-global-search"));
  };

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="w-full flex flex-col transition-colors duration-300">
        
        {/* Title Bar (Visible only when sidebar is closed on desktop) */}
        <div className={`w-full px-4 md:px-6 transition-all duration-300 bg-white/80 dark:bg-[#131314]/80 backdrop-blur-xl sticky top-0 z-20 flex items-center h-16 ${isSidebarOpen ? 'md:h-0 md:opacity-0 md:pointer-events-none' : ''}`}>
          <MobileHeaderToggle />
          <div className="w-full h-full flex items-center justify-between">
            <WorkspaceSwitcher />
          </div>
        </div>

        {/* Tabs Bar / Tool Header */}
        <div className={`w-full px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 bg-white dark:bg-[#131314] ${activeTool ? 'h-16' : (isSidebarOpen ? 'h-12 md:h-16' : 'h-12')}`}>
          <div className="w-full h-full flex items-center justify-between">
            {!activeTool ? (
              <>
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
                  <button 
                    onClick={() => setActiveTab("file")}
                    className={`h-full text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "file" ? "border-blue-600 text-slate-900 dark:text-white" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    File Utilities
                  </button>
                </nav>
              </>
            ) : (
              <div className="flex items-center gap-1 w-full">
                <button 
                  onClick={() => setActiveTool(null)}
                  className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="shrink-0 flex items-center justify-center">
                    {activeTool === "merge-pdf" ? (
                      <svg className="w-7 h-7 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    ) : activeTool === "split-pdf" ? (
                      <svg className="w-7 h-7 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                      </svg>
                    ) : activeTool === "convert-document" ? (
                      <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    ) : activeTool === "compress-file" ? (
                      <svg className="w-7 h-7 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    ) : activeTool === "extract-archive" ? (
                      <svg className="w-7 h-7 text-fuchsia-500 dark:text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    ) : activeTool === "encrypt-file" ? (
                      <svg className="w-7 h-7 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : activeTool === "decrypt-file" ? (
                      <svg className="w-7 h-7 text-sky-500 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    ) : activeTool === "convert-image" ? (
                      <svg className="w-7 h-7 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-7 h-7 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-[15px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                      {activeTool === "merge-pdf" ? "Merge PDF" : activeTool === "split-pdf" ? "Split PDF" : activeTool === "compress-file" ? t("compressFile") : activeTool === "extract-archive" ? t("extractArchive") : activeTool === "encrypt-file" ? t("encryptFile") : activeTool === "decrypt-file" ? t("decryptFile") : activeTool === "convert-image" ? t("imageConverter") : activeTool === "convert-document" ? t("documentConverter") : "Image Compressor"}
                    </h2>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-none hidden md:block">
                      {activeTool === "merge-pdf" 
                        ? "Combine multiple PDF files into one sequence."
                        : activeTool === "split-pdf"
                          ? "Extract pages or burst large PDF into single sheets."
                          : activeTool === "compress-file"
                            ? "Compress multiple files into a single ZIP archive."
                            : activeTool === "extract-archive"
                              ? "Extract files securely from ZIP, RAR, 7Z directly in browser."
                              : activeTool === "encrypt-file"
                                ? "Lock any file securely with AES-GCM encryption."
                                : activeTool === "decrypt-file"
                                  ? "Unlock files protected by Qupa Encryption."
                                  : activeTool === "convert-image"
                                    ? "Convert between JPG, PNG, WebP, SVG, and more effortlessly."
                                    : activeTool === "convert-document"
                                      ? "Convert PDF, DOCX, XLSX, and CSV with advanced layout retention."
                                      : "Compress and resize images with real-time visual comparison."}
                    </p>
                  </div>
                </div>
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
          {activeTool === "compress-file" && <ArchiveTool key="compress" mode="compress" />}
          {activeTool === "extract-archive" && <ArchiveTool key="extract" mode="extract" />}
          {activeTool === "encrypt-file" && <FileEncryptionTool key="encrypt" mode="encrypt" />}
          {activeTool === "decrypt-file" && <FileEncryptionTool key="decrypt" mode="decrypt" />}
          {activeTool === "convert-image" && <ImageConverter />}
          {activeTool === "convert-document" && <DocumentConverter />}

          {!activeTool && activeTab === "document" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">{t("documentConverter")}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Convert PDF, DOCX, XLSX, and CSV with advanced layout retention.</p>
                <button onClick={() => setActiveTool("convert-document")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>
              
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-orange-500/20 ring-1 ring-orange-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">Merge PDF</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Combine multiple PDF files into one clean document sequence effortlessly.</p>
                <button onClick={() => setActiveTool("merge-pdf")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-red-500 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-red-500/20 ring-1 ring-red-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                  </svg>
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

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-blue-500/20 ring-1 ring-blue-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">{t("imageConverter")}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Convert between JPG, PNG, WebP, SVG, and more effortlessly.</p>
                <button onClick={() => setActiveTool("convert-image")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>
              
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-teal-500/20 ring-1 ring-teal-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">Image Compressor</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Compress JPG, WebP, and PNG sizes while maintaining stunning visual quality.</p>
                <button onClick={() => setActiveTool("compress-image")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

            </div>
          )}

          {!activeTool && activeTab === "file" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">{t("compressFile")}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Create ZIP files with optional password protection.</p>
                <button onClick={() => setActiveTool("compress-file")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-fuchsia-500/20 ring-1 ring-fuchsia-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">{t("extractArchive")}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Extract files from ZIP, RAR, 7Z, TAR directly in your browser.</p>
                <button onClick={() => setActiveTool("extract-archive")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-emerald-500/20 ring-1 ring-emerald-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">{t("encryptFile")}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Lock any file securely with AES-GCM encryption.</p>
                <button onClick={() => setActiveTool("encrypt-file")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Open Workspace
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center mb-3 shadow-sm shadow-sky-500/20 ring-1 ring-sky-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">{t("decryptFile")}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5 flex-1">Unlock files protected by Qupa Encryption.</p>
                <button onClick={() => setActiveTool("decrypt-file")} className="w-full py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
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