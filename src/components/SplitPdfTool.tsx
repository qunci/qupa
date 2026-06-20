"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

type SplitMode = "extract" | "burst_pdf" | "burst_img";

function pagesToRangeString(pages: number[]): string {
  if (pages.length === 0) return "";
  const sorted = [...pages].sort((a, b) => a - b);
  let ranges = [];
  let start = sorted[0];
  let end = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = sorted[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(", ");
}

const PageThumbnail = ({ pdf, pageNum, isSelected, onToggle }: { pdf: any, pageNum: number, isSelected: boolean, onToggle: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let renderTask: any;
    let isActive = true;

    pdf.getPage(pageNum).then((page: any) => {
      if (!isActive) return;
      const viewport = page.getViewport({ scale: 0.4 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      
      renderTask = page.render({ canvasContext: ctx, viewport, canvas } as any);
    }).catch(console.error);

    return () => {
      isActive = false;
      if (renderTask) renderTask.cancel();
    };
  }, [pdf, pageNum]);

  return (
    <div 
      onClick={onToggle} 
      className={`relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-4 aspect-[1/1.4] bg-white ${isSelected ? 'border-blue-600 shadow-lg scale-95' : 'border-transparent shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'}`}
    >
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded shadow-sm font-semibold">
        {pageNum}
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
      )}
    </div>
  );
};

export default function SplitPdfTool({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pdfJsDoc, setPdfJsDoc] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<SplitMode>("extract");
  const [rangeInput, setRangeInput] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024, sizes = ["Bytes", "KB", "MB", "GB"], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFile = async (newFile: File) => {
    if (newFile.type !== "application/pdf" && !newFile.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported.");
      return;
    }
    
    const toastId = toast.loading("Analyzing PDF...");
    try {
      const arrayBuffer = await newFile.arrayBuffer();
      
      // Copy the buffer for pdfjs-dist because sending it to the Web Worker detaches the original ArrayBuffer
      const pdfJsBuffer = arrayBuffer.slice(0);
      
      // Load with pdfjs-dist for rendering thumbnails FIRST to catch worker errors early
      const loadedPdfJs = await pdfjsLib.getDocument({ 
        data: new Uint8Array(pdfJsBuffer),
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
      }).promise;
      
      // Load with pdf-lib to get basic info
      const pdf = await PDFDocument.load(arrayBuffer);
      const numPages = pdf.getPageCount();
      
      setPdfJsDoc(loadedPdfJs);
      setTotalPages(numPages);
      setFile(newFile);
      setRangeInput(`1-${numPages}`);

      toast.success("PDF loaded successfully!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to read PDF file: ${error?.message || "Unknown error"}`, { id: toastId });
    }
  };

  const parseRange = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= maxPages) pages.add(i);
          }
        }
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pages.add(num);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const togglePage = (pageNum: number) => {
    const currentPages = new Set(parseRange(rangeInput, totalPages));
    if (currentPages.has(pageNum)) {
      currentPages.delete(pageNum);
    } else {
      currentPages.add(pageNum);
    }
    setRangeInput(pagesToRangeString(Array.from(currentPages)));
  };

  const handleProcess = async () => {
    if (!file) return;

    const targetPages = parseRange(rangeInput, totalPages);
    if (targetPages.length === 0) {
      toast.error("Please enter a valid page range or select pages.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

      if (mode === "extract") {
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(originalPdf, targetPages.map(p => p - 1));
        copiedPages.forEach((page) => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        triggerDownload(new Blob([pdfBytes as any], { type: "application/pdf" }), `${baseName}_extracted.pdf`);
      
      } else if (mode === "burst_pdf") {
        const zip = new JSZip();
        for (const pageNum of targetPages) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(originalPdf, [pageNum - 1]);
          newPdf.addPage(copiedPage);
          const pdfBytes = await newPdf.save();
          zip.file(`${baseName}_page_${pageNum}.pdf`, pdfBytes);
        }
        
        const zipBlob = await zip.generateAsync({ type: "blob" });
        triggerDownload(zipBlob, `${baseName}_burst.zip`);

      } else if (mode === "burst_img") {
        const zip = new JSZip();
        for (const pageNum of targetPages) {
          const page = await pdfJsDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 }); 
          
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Could not create canvas context");
          
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
          
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
          if (blob) {
            zip.file(`${baseName}_page_${pageNum}.jpg`, blob);
          }
        }
        
        const zipBlob = await zip.generateAsync({ type: "blob" });
        triggerDownload(zipBlob, `${baseName}_images.zip`);
      }

      toast.success("Processing complete!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during processing.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedPagesSet = new Set(parseRange(rangeInput, totalPages));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">✂️</span> Split PDF
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Extract pages or burst documents into individual files.</p>
        </div>
      </div>

      {!file ? (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
            isDragging 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400" 
              : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-200">Click to upload PDF</span> or drag and drop</p>
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Visual Selection Area */}
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <div className="flex items-center gap-3 overflow-hidden pr-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xs shrink-0">
                  PDF
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{file.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{formatBytes(file.size)} &bull; {totalPages} pages</span>
                </div>
              </div>
              <button onClick={() => { setFile(null); setPdfJsDoc(null); }} className="text-sm font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0">
                Remove
              </button>
            </div>

            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 h-[500px] overflow-y-auto">
              {pdfJsDoc ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PageThumbnail 
                      key={i + 1} 
                      pdf={pdfJsDoc} 
                      pageNum={i + 1} 
                      isSelected={selectedPagesSet.has(i + 1)}
                      onToggle={() => togglePage(i + 1)}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  Loading previews...
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Tools Area */}
          <div className="w-full lg:w-80 space-y-6 shrink-0">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                <span>Selected Pages</span>
                <span className="text-blue-600 dark:text-blue-400">{selectedPagesSet.size} selected</span>
              </label>
              <input 
                type="text" 
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder={`e.g., 1, 3, 5-${totalPages}`}
                className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Click pages on the left or type numbers manually (e.g. 1-3, 5).</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Operation Mode</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <input type="radio" name="mode" checked={mode === "extract"} onChange={() => setMode("extract")} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">Extract to Single PDF</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <input type="radio" name="mode" checked={mode === "burst_pdf"} onChange={() => setMode("burst_pdf")} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">Burst to Individual PDFs</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <input type="radio" name="mode" checked={mode === "burst_img"} onChange={() => setMode("burst_img")} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">Convert to Images (ZIP)</span>
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={handleProcess}
              disabled={isProcessing || selectedPagesSet.size === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md ${
                isProcessing || selectedPagesSet.size === 0
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {isProcessing ? "Processing..." : mode === "extract" ? "Extract PDF" : "Download ZIP"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
