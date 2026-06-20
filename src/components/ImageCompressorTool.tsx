"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<string>("webp");
  const [maxWidth, setMaxWidth] = useState<number | "">("");
  
  const [sliderPos, setSliderPos] = useState(50);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB", "GB"], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = (newFile: File) => {
    if (!newFile.type.startsWith("image/")) {
      toast.error("Only image files are supported.");
      return;
    }
    
    setFile(newFile);
    setOriginalSize(newFile.size);
    
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    const newOriginalUrl = URL.createObjectURL(newFile);
    setOriginalUrl(newOriginalUrl);
    
    // Auto compress will trigger via useEffect
  };

  const compressImage = useCallback(() => {
    if (!originalUrl) return;
    
    setIsCompressing(true);
    
    const img = new Image();
    img.src = originalUrl;
    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;
        
        const targetWidth = typeof maxWidth === "number" && maxWidth > 0 ? maxWidth : null;
        
        if (targetWidth && width > targetWidth) {
          const ratio = targetWidth / width;
          width = targetWidth;
          height = height * ratio;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) throw new Error("Canvas context error");
        
        // Fill white background for JPEG
        if (format === "jpeg" || format === "jpg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
        
        canvas.toBlob((blob) => {
          if (blob) {
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            setCompressedUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
          }
          setIsCompressing(false);
        }, mimeType, quality / 100);
        
      } catch (err) {
        console.error(err);
        toast.error("Compression failed");
        setIsCompressing(false);
      }
    };
    img.onerror = () => {
      setIsCompressing(false);
    };
  }, [originalUrl, quality, format, maxWidth]);

  // Debounce the compression slightly to avoid lagging the UI when dragging the slider
  useEffect(() => {
    const timer = setTimeout(() => {
      if (file) compressImage();
    }, 300);
    return () => clearTimeout(timer);
  }, [compressImage, file]);

  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const extension = format === "jpeg" ? "jpg" : format;
    const filename = `${baseName}_compressed.${extension}`;
    
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getSavingsPercent = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    const savings = ((originalSize - compressedSize) / originalSize) * 100;
    return savings.toFixed(1);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
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
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Upload Image to Compress</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Drag & drop or click to browse (JPG, PNG, WebP)</p>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Main Visual Comparison Area */}
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between border border-slate-200 dark:border-slate-700 gap-4">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-sm">{file.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 font-medium line-through decoration-red-400">{formatBytes(originalSize)}</span>
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatBytes(compressedSize)}</span>
                  {originalSize > 0 && compressedSize > 0 && (
                    <span className="ml-2 text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      -{getSavingsPercent()}%
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => { setFile(null); setOriginalUrl(null); setCompressedUrl(null); }} className="text-sm font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Choose New Image
              </button>
            </div>

            <div className="bg-slate-100 dark:bg-[#18181B] rounded-2xl p-4 border border-slate-200 dark:border-slate-800/60 shadow-inner min-h-[400px] flex items-center justify-center relative overflow-hidden">
              {originalUrl && compressedUrl ? (
                <div className="relative w-full max-w-3xl aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden shadow-md select-none group bg-checkered dark:bg-checkered-dark">
                  
                  {/* Base Image (After) */}
                  <img src={compressedUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" alt="Compressed" />
                  
                  {/* Clipped Image (Before) */}
                  <div 
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <img src={originalUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" alt="Original" />
                  </div>

                  {/* Slider Control */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 text-slate-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)"/></svg>
                    </div>
                  </div>

                  {/* Invisible Range Input Overlay */}
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0"
                  />

                  {/* Labels */}
                  <div className={`absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg z-10 pointer-events-none transition-opacity duration-300 ${sliderPos < 15 ? 'opacity-0' : 'opacity-100'}`}>
                    Original ({formatBytes(originalSize)})
                  </div>
                  <div className={`absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg z-10 pointer-events-none transition-opacity duration-300 ${sliderPos > 85 ? 'opacity-0' : 'opacity-100'}`}>
                    Compressed ({formatBytes(compressedSize)})
                  </div>

                  {isCompressing && (
                    <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[2px] z-40 flex items-center justify-center">
                      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-full font-semibold shadow-lg text-sm flex items-center gap-2 animate-pulse">
                        <svg className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"></path>
                        </svg>
                        Compressing...
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <p className="text-center text-sm text-slate-500 font-medium">Slide to compare Original vs Compressed</p>
          </div>

          {/* Control Panel */}
          <div className="w-full xl:w-80 flex flex-col shrink-0 bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Compression Settings</h3>
            
            <div className="space-y-5 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["webp", "jpeg", "png"] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`py-2 text-sm font-semibold rounded-lg transition-colors border ${
                        format === fmt 
                          ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400 dark:text-blue-300" 
                          : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Quality</label>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{quality}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="100" 
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={format === "png"}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 ${format === 'png' ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-50' : 'bg-slate-200 dark:bg-slate-700'}`}
                />
                {format === "png" && (
                  <p className="text-xs text-orange-500 mt-1.5 font-medium">PNG is lossless. Quality slider is disabled.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Resize Width (px)</label>
                <input 
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Optional max width"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Leave empty to keep original dimensions.</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <hr className="border-slate-200 dark:border-slate-800" />

              <button 
                onClick={handleDownload}
                disabled={isCompressing || !compressedUrl}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isCompressing || !compressedUrl
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Image
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
