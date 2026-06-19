"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import heic2any from "heic2any";
import { useSettings } from "@/hooks/useSettings";

type TargetOption = { id: string; label: string; locked: boolean };

const IMAGE_CONVERSION_MAP: Record<string, TargetOption[]> = {
  jpg: [{ id: "png", label: "PNG (Lossless)", locked: false }, { id: "webp", label: "WebP (Optimized)", locked: false }, { id: "gif", label: "GIF (Animated) - Coming Soon", locked: true }, { id: "svg", label: "SVG (Vector) - Coming Soon", locked: true }, { id: "pdf", label: "PDF Document - Coming Soon", locked: true }],
  jpeg: [{ id: "png", label: "PNG (Lossless)", locked: false }, { id: "webp", label: "WebP (Optimized)", locked: false }, { id: "gif", label: "GIF (Animated) - Coming Soon", locked: true }, { id: "svg", label: "SVG (Vector) - Coming Soon", locked: true }, { id: "pdf", label: "PDF Document - Coming Soon", locked: true }],
  png: [{ id: "jpeg", label: "JPEG (Standard)", locked: false }, { id: "webp", label: "WebP (Optimized)", locked: false }, { id: "gif", label: "GIF (Animated) - Coming Soon", locked: true }, { id: "svg", label: "SVG (Vector) - Coming Soon", locked: true }, { id: "ico", label: "ICO (Windows Icon) - Coming Soon", locked: true }],
  webp: [{ id: "jpeg", label: "JPEG (Standard)", locked: false }, { id: "png", label: "PNG (Lossless)", locked: false }, { id: "gif", label: "GIF (Animated) - Coming Soon", locked: true }],
  heic: [{ id: "jpeg", label: "JPEG (Standard)", locked: false }, { id: "png", label: "PNG (Lossless)", locked: false }],
  svg: [{ id: "png", label: "PNG (Lossless)", locked: false }, { id: "jpeg", label: "JPEG (Standard)", locked: false }],
  gif: [{ id: "mp4", label: "MP4 (Video) - Coming Soon", locked: true }, { id: "webp", label: "WebP (Animated) - Coming Soon", locked: true }]
};

export default function ImageConverter() {
  const { t } = useSettings();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileExt, setFileExt] = useState<string>("");
  const [convertTarget, setConvertTarget] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState<number>(90);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024, sizes = ["Bytes", "KB", "MB", "GB"], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFile = async (file: File) => {
    // Quality First: Prevent browser crash on massive files
    // 20MB limit for Free/Local mode
    if (file.size > 20 * 1024 * 1024) {
      toast.error(t("fileTooLarge"), { duration: 5000 });
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || "";
    if (IMAGE_CONVERSION_MAP[extension]) {
      setFileExt(extension);
      setSelectedFile(file);
      setConvertTarget(IMAGE_CONVERSION_MAP[extension][0].id);
      setConvertedUrl(null);

      // Local First: Process HEIC entirely in-browser
      if (extension === "heic") {
        const toastId = toast.loading(t("heicProcessing"));
        try {
          const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
          const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          setPreviewUrl(URL.createObjectURL(blobToUse));
          toast.success(t("heicSuccess"), { id: toastId });
        } catch (error) {
          console.error(error);
          toast.error(t("heicError"), { id: toastId });
          setSelectedFile(null); // Reset
        }
      } else {
        setPreviewUrl(URL.createObjectURL(file));
      }
    } else if (file.type === "application/pdf" || file.type.includes("word")) {
      toast.error(t("wrongConverterDoc"));
    } else {
      toast.error(`${t("unsupportedFormat")} .${extension}`);
    }
  };

  const handleConvert = () => {
    if (!selectedFile || !previewUrl) return;
    setIsConverting(true);
    const toastId = toast.loading(`${t("convertingTo")} ${convertTarget.toUpperCase()}...`);
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");
        if (convertTarget === "jpeg" || convertTarget === "jpg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL(`image/${convertTarget === "jpg" ? "jpeg" : convertTarget}`, quality / 100);
        setConvertedUrl(dataUrl);
        toast.success(t("convertSuccess"), { id: toastId });
      } catch {
        toast.error(t("convertError"), { id: toastId });
      } finally {
        setIsConverting(false);
      }
    };
    img.onerror = () => {
      toast.error(t("convertError"), { id: toastId });
      setIsConverting(false);
    };
  };

  const handleReset = () => {
    setSelectedFile(null);
    setConvertedUrl(null);
    setFileExt("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const currentOptions = IMAGE_CONVERSION_MAP[fileExt] || [];
  const selectedOptionObj = currentOptions.find(opt => opt.id === convertTarget);
  const isCurrentlyLocked = selectedOptionObj ? selectedOptionObj.locked : true;
  const showQualitySlider = (convertTarget === "jpeg" || convertTarget === "webp") && !isCurrentlyLocked;

  // UPLOAD STATE
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
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">JPG, PNG, WebP, SVG, HEIC & more</p>
          <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.svg,.heic,.gif,.bmp" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
        </label>
      </div>
    );
  }

  // WORKSPACE STATE
  return (
    <div className="space-y-6">
      
      {/* Visual Preview - PERBAIKAN: bg-slate-100 di mode terang, dark:bg-slate-900 di mode gelap */}
      <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-6 relative transition-colors duration-300">
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Preview" className="max-h-64 object-contain shadow-lg rounded" />
        )}
      </div>

      {/* File Info Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="flex items-center gap-3 overflow-hidden pr-4">
           {isCurrentlyLocked ? (
             <svg className="w-8 h-8 shrink-0 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
               <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
             </svg>
           ) : (
             <svg className="w-8 h-8 shrink-0 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
           )}
           <div className="flex flex-col truncate">
             <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{selectedFile.name}</span>
             <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{formatBytes(selectedFile.size)}</span>
           </div>
        </div>
        <button onClick={handleReset} className="text-sm font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0">
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
              onChange={(e) => {
                setConvertTarget(e.target.value);
                setConvertedUrl(null);
              }} 
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-colors duration-300"
            >
              {currentOptions.map((opt) => (
                <option key={opt.id} value={opt.id} disabled={opt.locked}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          
          {showQualitySlider && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="quality-slider" className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("compressionQuality")}</label>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{quality}%</span>
              </div>
              <input 
                id="quality-slider"
                type="range" min="10" max="100" 
                value={quality} 
                onChange={(e) => { setQuality(Number(e.target.value)); setConvertedUrl(null); }} 
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}
        </div>

        <div className="flex items-end h-full mt-auto">
          {convertedUrl ? (
            <a 
              href={convertedUrl} 
              download={`${selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name}_qupa.${convertTarget}`}
              className="w-full bg-green-600 dark:bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              {t("downloadImage")}
            </a>
          ) : (
            <button 
              onClick={handleConvert} 
              disabled={isConverting || isCurrentlyLocked} 
              className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                isCurrentlyLocked 
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`}
            >
              {isCurrentlyLocked ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  {t("serverRequired")}
                </>
              ) : isConverting ? t("processing") : t("convertNow")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}