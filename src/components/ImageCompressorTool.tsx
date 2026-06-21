"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";
import JSZip from "jszip";

interface CompressedImage {
  id: string;
  file: File;
  originalUrl: string;
  originalSize: number;
  compressedUrl: string | null;
  compressedSize: number;
  status: 'pending' | 'compressing' | 'done' | 'error';
}

export default function ImageCompressorTool() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  const [isDragging, setIsDragging] = useState(false);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<string>("webp");
  const [maxWidth, setMaxWidth] = useState<number | "">("");
  
  const [sliderPos, setSliderPos] = useState(50);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useSettings();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB", "GB"], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getSavingsPercent = (orig: number, comp: number) => {
    if (orig === 0 || comp === 0) return 0;
    const savings = ((orig - comp) / orig) * 100;
    return savings.toFixed(1);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
        if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiles = (filesList: FileList | File[]) => {
    const newImages: CompressedImage[] = [];
    const ArrayFiles = Array.from(filesList);
    
    let addedCount = 0;
    for (let i = 0; i < ArrayFiles.length; i++) {
      const f = ArrayFiles[i];
      if (!f.type.startsWith("image/")) continue;
      
      newImages.push({
        id: Math.random().toString(36).substring(2, 11),
        file: f,
        originalUrl: URL.createObjectURL(f),
        originalSize: f.size,
        compressedUrl: null,
        compressedSize: 0,
        status: 'pending'
      });
      addedCount++;
    }

    if (addedCount === 0) {
      toast.error("No valid image files found.");
      return;
    }

    setImages(prev => [...prev, ...newImages]);
    
    // If it was empty, set active index to the first of the newly added
    if (images.length === 0) {
      setActiveIndex(0);
      setSliderPos(50);
    }
  };

  const compressSingleImage = (imgState: CompressedImage, q: number, fmt: string, mw: number | ""): Promise<CompressedImage> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imgState.originalUrl;
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;
          
          const targetWidth = typeof mw === "number" && mw > 0 ? mw : null;
          
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
          if (fmt === "jpeg" || fmt === "jpg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          const mimeType = fmt === "jpg" ? "image/jpeg" : `image/${fmt}`;
          
          canvas.toBlob((blob) => {
            if (blob) {
              const newUrl = URL.createObjectURL(blob);
              resolve({
                ...imgState,
                compressedUrl: newUrl,
                compressedSize: blob.size,
                status: 'done'
              });
            } else {
              resolve({ ...imgState, status: 'error' });
            }
          }, mimeType, q / 100);
          
        } catch (err) {
          console.error(err);
          resolve({ ...imgState, status: 'error' });
        }
      };
      img.onerror = () => resolve({ ...imgState, status: 'error' });
    });
  };

  // Debounced effect to compress the ACTIVE image when settings change or active index changes
  useEffect(() => {
    const activeImg = images[activeIndex];
    if (!activeImg || activeImg.status !== 'pending') return;

    const timer = setTimeout(async () => {
      setImages(prev => prev.map((img, idx) => idx === activeIndex ? { ...img, status: 'compressing' } : img));
      const result = await compressSingleImage(activeImg, quality, format, maxWidth);
      
      // Cleanup old URL if it exists
      if (activeImg.compressedUrl && activeImg.compressedUrl !== result.compressedUrl) {
        URL.revokeObjectURL(activeImg.compressedUrl);
      }

      setImages(prev => prev.map((img, idx) => idx === activeIndex ? result : img));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [activeIndex, images, quality, format, maxWidth]);

  // When settings change, invalidate all compressed images
  const handleSettingsChange = (type: 'format'|'quality'|'maxWidth', value: any) => {
    if (type === 'format') setFormat(value);
    if (type === 'quality') setQuality(value);
    if (type === 'maxWidth') setMaxWidth(value);

    setImages(prev => prev.map(img => ({ ...img, status: 'pending' })));
  };

  const activeImg = images[activeIndex] || null;

  const handleDownloadActive = () => {
    if (!activeImg || !activeImg.compressedUrl) return;
    const baseName = activeImg.file.name.substring(0, activeImg.file.name.lastIndexOf('.')) || activeImg.file.name;
    const extension = format === "jpeg" ? "jpg" : format;
    const filename = `${baseName}_compressed.${extension}`;
    
    const a = document.createElement("a");
    a.href = activeImg.compressedUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = async () => {
    if (images.length === 0) return;
    
    setIsBatchProcessing(true);
    
    // First, compress any pending images sequentially to not freeze the browser
    const pendingImages = images.filter(img => img.status === 'pending');
    setBatchProgress({ current: 0, total: images.length });
    
    let currentImages = [...images];

    for (let i = 0; i < currentImages.length; i++) {
      if (currentImages[i].status === 'pending' || currentImages[i].status === 'error') {
        setImages(prev => prev.map((img, idx) => idx === i ? { ...img, status: 'compressing' } : img));
        const result = await compressSingleImage(currentImages[i], quality, format, maxWidth);
        
        if (currentImages[i].compressedUrl) {
           URL.revokeObjectURL(currentImages[i].compressedUrl!);
        }

        currentImages[i] = result;
        setImages([...currentImages]);
      }
      setBatchProgress({ current: i + 1, total: images.length });
    }

    // Now all are compressed, generate ZIP
    toast.info("Generating ZIP file...");
    
    try {
      const zip = new JSZip();
      
      for (const img of currentImages) {
        if (img.status === 'done' && img.compressedUrl) {
          const response = await fetch(img.compressedUrl);
          const blob = await response.blob();
          const baseName = img.file.name.substring(0, img.file.name.lastIndexOf('.')) || img.file.name;
          const extension = format === "jpeg" ? "jpg" : format;
          zip.file(`${baseName}_compressed.${extension}`, blob);
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = "Qupa_Compressed_Images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(zipUrl), 10000);
      toast.success("ZIP downloaded successfully!");
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ZIP");
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    const img = images[index];
    if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
    if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    if (activeIndex >= index && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const clearAll = () => {
    images.forEach(img => {
      if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
    setActiveIndex(0);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {images.length === 0 ? (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
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
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Upload Images</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Drag & drop or click to browse (Batch processing supported)</p>
          <input ref={fileInputRef} type="file" multiple className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        </div>
      ) : (
        <div className="w-full flex flex-col space-y-6">
          <div className="flex flex-col xl:flex-row gap-6">
            
            {/* Main Visual Comparison Area */}
            <div className="flex-1 space-y-4 flex flex-col">
              
              {activeImg && (
                <div className="bg-slate-100 dark:bg-[#18181B] rounded-2xl p-4 border border-slate-200 dark:border-slate-800/60 shadow-inner flex-1 min-h-[300px] md:min-h-[400px] flex items-center justify-center relative overflow-hidden">
                  {activeImg.compressedUrl ? (
                    <div className="relative w-full max-w-3xl aspect-[4/3] sm:aspect-video select-none group">
                      
                      <div className="absolute inset-0 rounded-xl overflow-hidden shadow-md bg-checkered dark:bg-checkered-dark pointer-events-none">
                        <img src={activeImg.compressedUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" alt="Compressed" />
                        
                        <div 
                          className="absolute inset-0 w-full h-full overflow-hidden"
                          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                        >
                          <img src={activeImg.originalUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" alt="Original" />
                        </div>
                      </div>

                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                        style={{ left: `clamp(0%, ${sliderPos}%, 100%)` }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 text-slate-500 pointer-events-auto cursor-ew-resize">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)"/></svg>
                        </div>
                      </div>

                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={sliderPos}
                        onChange={(e) => setSliderPos(Number(e.target.value))}
                        className="absolute top-[30%] bottom-[30%] h-[40%] w-full opacity-0 cursor-ew-resize z-30 m-0 touch-pan-y"
                      />

                      <div className={`absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg z-10 pointer-events-none transition-opacity duration-300 ${sliderPos < 15 ? 'opacity-0' : 'opacity-100'}`}>
                        Original ({formatBytes(activeImg.originalSize)})
                      </div>
                      <div className={`absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg z-10 pointer-events-none transition-opacity duration-300 ${sliderPos > 85 ? 'opacity-0' : 'opacity-100'}`}>
                        Compressed ({formatBytes(activeImg.compressedSize)})
                      </div>
                    </div>
                  ) : activeImg.status === 'compressing' ? (
                    <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">Compressing preview...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4">
                       <p className="font-semibold text-slate-500 dark:text-slate-400">Waiting for processing...</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Batch Images List */}
              <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Batch Queue ({images.length})</h3>
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2.5 py-1.5 rounded-lg transition-colors">
                      + Add More
                    </button>
                    <button onClick={clearAll} className="text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                      {t("clearAll")}
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" multiple className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                  {images.map((img, idx) => (
                    <div 
                      key={img.id}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative flex-shrink-0 w-32 rounded-lg border-2 cursor-pointer transition-all snap-start overflow-hidden group ${
                        idx === activeIndex 
                          ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square bg-slate-100 dark:bg-slate-900 relative">
                        <img src={img.originalUrl} className="w-full h-full object-cover" alt="thumbnail" />
                        
                        {/* Status Overlay */}
                        {img.status === 'compressing' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        {img.status === 'done' && (
                          <div className="absolute top-1.5 right-1.5 bg-green-500 text-white rounded-full p-0.5 shadow-sm">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                          </div>
                        )}
                        
                        {/* Remove button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute top-1.5 left-1.5 bg-red-500/90 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                      
                      <div className="p-2 bg-white dark:bg-slate-800">
                        <p className="text-[10px] font-medium text-slate-800 dark:text-slate-200 truncate" title={img.file.name}>{img.file.name}</p>
                        {img.status === 'done' ? (
                          <p className="text-[10px] font-bold text-green-600 dark:text-green-400 mt-0.5">-{getSavingsPercent(img.originalSize, img.compressedSize)}%</p>
                        ) : (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{formatBytes(img.originalSize)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Control Panel */}
            <div className="w-full xl:w-80 flex flex-col shrink-0 bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Compression Settings</h3>
              
              <div className="space-y-5 flex-1 pointer-events-auto">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Output Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["webp", "jpeg", "png"] as const).map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => handleSettingsChange('format', fmt)}
                        disabled={isBatchProcessing}
                        className={`py-2 text-sm font-semibold rounded-lg transition-colors border ${
                          format === fmt 
                            ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400 dark:text-blue-300" 
                            : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                    onChange={(e) => handleSettingsChange('quality', Number(e.target.value))}
                    disabled={format === "png" || isBatchProcessing}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 ${format === 'png' || isBatchProcessing ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-50' : 'bg-slate-200 dark:bg-slate-700'}`}
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
                    onChange={(e) => handleSettingsChange('maxWidth', e.target.value ? Number(e.target.value) : "")}
                    disabled={isBatchProcessing}
                    placeholder="Optional max width"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 disabled:opacity-50"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Leave empty to keep original dimensions.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <hr className="border-slate-200 dark:border-slate-800 mb-4" />

                {isBatchProcessing && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      <span>Processing...</span>
                      <span>{batchProgress.current} / {batchProgress.total}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}></div>
                    </div>
                  </div>
                )}

                {images.length === 1 ? (
                  <button 
                    onClick={handleDownloadActive}
                    disabled={isBatchProcessing || activeImg?.status !== 'done'}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isBatchProcessing || activeImg?.status !== 'done'
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Image
                  </button>
                ) : (
                  <button 
                    onClick={handleDownloadAll}
                    disabled={isBatchProcessing || images.every(i => i.status === 'error')}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isBatchProcessing || images.every(i => i.status === 'error')
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {t("downloadZip")} ({images.length})
                  </button>
                )}
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
