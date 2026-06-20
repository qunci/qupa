"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";

export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024, sizes = ["Bytes", "KB", "MB", "GB"], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFiles = (newFiles: FileList | File[]) => {
    const validFiles = Array.from(newFiles).filter(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (validFiles.length < newFiles.length) {
      toast.error("Some files were skipped. Only PDF files are supported.");
    }
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const copy = [...prev];
      [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
      return copy;
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Merging PDFs...");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `Qupa_Merged_${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDFs merged successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while merging the PDFs.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <AnimatePresence mode="popLayout">
        {files.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
            className={`w-full p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              isDragging 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400 scale-[1.02]" 
                : "border-slate-300 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/40"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Upload PDFs to Merge</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Drag and drop your files here, or click to browse</p>
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf" multiple onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
      {files.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Files to Merge ({files.length})</h3>
            <button 
              onClick={() => setFiles([])}
              className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-96 overflow-y-auto">
            {files.map((file, idx) => (
              <li key={`${file.name}-${idx}`} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col">
                    <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 text-slate-400 hover:text-blue-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button onClick={() => moveDown(idx)} disabled={idx === files.length - 1} className="p-1 text-slate-400 hover:text-blue-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                  <button onClick={() => removeFile(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-[#18181A]/50 backdrop-blur-md">
            <button 
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                files.length < 2 || isProcessing
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
              }`}
            >
              {isProcessing ? "Merging your PDFs..." : "Merge PDFs Now"}
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

    </div>
  );
}
