"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useSettings } from "@/hooks/useSettings";

export default function DocumentConverter() {
  const { t } = useSettings();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [convertTarget, setConvertTarget] = useState<string>("png_seq");

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024, sizes = ["Bytes", "KB", "MB", "GB"], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFile = (file: File) => {
    // Validasi sederhana
    const extension = file.name.split('.').pop()?.toLowerCase() || "";
    const allowedExts = ["pdf", "docx", "xlsx", "pptx", "csv", "txt"];
    
    if (allowedExts.includes(extension)) {
      setSelectedFile(file);
    } else {
      toast.error(`${t("unsupportedFormat")} .${extension}`);
    }
  };

  // UPLOAD STATE (SUDAH FULL DARK MODE)
  if (!selectedFile) {
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) handleFile(e.dataTransfer.files[0]); }}
        className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400"
            : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
        }`}
      >
        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
          <svg className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-200">{t("clickToUpload")}</span> {t("orDragDrop")}</p>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">PDF, DOCX, XLSX, PPTX, CSV, TXT</p>
          <input type="file" className="hidden" accept=".pdf,.docx,.xlsx,.pptx,.csv,.txt" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
        </label>
      </div>
    );
  }

  // WORKSPACE STATE (SUDAH FULL DARK MODE)
  return (
    <div className="space-y-6">
      
      {/* File Info Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="flex items-center gap-3 overflow-hidden pr-4">
          <svg className="w-8 h-8 shrink-0 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="currentColor" className="text-blue-500" />
          </svg>
          <div className="flex flex-col truncate">
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{selectedFile.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{formatBytes(selectedFile.size)}</span>
          </div>
        </div>
        <button onClick={() => setSelectedFile(null)} className="text-sm font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0">
          {t("remove")}
        </button>
      </div>

      {/* Conversion Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="convert-target" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("convertTo")}</label>
            <select
              id="convert-target"
              value={convertTarget}
              onChange={(e) => setConvertTarget(e.target.value)}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-colors duration-300"
            >
              <option value="png_seq">PNG (Image sequence)</option>
              <option value="jpeg_seq">JPEG (Image sequence)</option>
              <option value="docx" disabled>Word Document (.docx) - Coming Soon</option>
              <option value="xlsx" disabled>Excel Spreadsheet (.xlsx) - Coming Soon</option>
              <option value="pptx" disabled>PowerPoint (.pptx) - Coming Soon</option>
              <option value="txt" disabled>Plain Text (.txt) - Coming Soon</option>
            </select>
          </div>
        </div>

        <div className="flex items-end h-full mt-auto">
          <button
            onClick={() => toast.error(t("docPending"))}
            className="w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            {t("convertNow")}
          </button>
        </div>
      </div>

    </div>
  );
}