"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// --- Core Component ---
function ConverterContent({ mode }: { mode: string | null }) {
  // Configuration
  const getModeConfig = () => {
    switch (mode) {
      case "jpg-to-png": return { accept: "image/jpeg", text: "Only JPG files", target: "image/png", locked: true };
      case "jpg-to-webp": return { accept: "image/jpeg", text: "Only JPG files", target: "image/webp", locked: true };
      case "png-to-jpg": return { accept: "image/png", text: "Only PNG files", target: "image/jpeg", locked: true };
      case "webp-to-png": return { accept: "image/webp", text: "Only WebP files", target: "image/png", locked: true };
      default: return { accept: "image/jpeg, image/png, image/webp", text: "JPG, PNG, or WebP", target: "image/webp", locked: false };
    }
  };
  const config = getModeConfig();

  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>(config.target);
  const [quality, setQuality] = useState<number>(90);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Handlers
  const processFile = (file: File) => {
    if (config.locked && file.type !== config.accept) {
      toast.error(`Invalid format! Please upload ${config.text}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large! Maximum allowed size is 10MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setConvertedUrl(null);
    setConvertedSize(null);
    toast.success("Image loaded successfully!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Logic
  const calculateBase64Size = (dataURI: string) => {
    const base64str = dataURI.split(",")[1];
    try { return atob(base64str).length; } catch { return 0; }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleConvert = () => {
    if (!selectedFile || !previewUrl) return;
    
    setIsConverting(true);
    const toastId = toast.loading("Converting image...");

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Failed to initialize conversion engine", { id: toastId });
        setIsConverting(false);
        return;
      }

      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(targetFormat, quality / 100);
      setConvertedUrl(dataUrl);
      setConvertedSize(calculateBase64Size(dataUrl));
      setIsConverting(false);
      
      toast.success("Conversion complete!", { id: toastId });
    };

    img.onerror = () => {
      toast.error("Failed to process image", { id: toastId });
      setIsConverting(false);
    };
  };

  // Cleanup
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  // Derived Values
  const getFileExtension = (mimeType: string) => mimeType.split("/")[1];
  const downloadName = selectedFile 
    ? `${selectedFile.name.split('.')[0]}_qupa.${getFileExtension(targetFormat)}`
    : "converted_image";
  const showQualitySlider = targetFormat === "image/jpeg" || targetFormat === "image/webp";
  const sizeDifference = selectedFile && convertedSize 
    ? ((selectedFile.size - convertedSize) / selectedFile.size) * 100 : 0;

  // Render
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200 mt-10">
      
      {mode && (
        <div className="mb-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Active Mode: {mode.toUpperCase().replace(/-/g, " ")}
          </span>
        </div>
      )}

      {!selectedFile && (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors duration-200 ${
            isDragging ? "border-blue-500 bg-blue-50/50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className={`w-10 h-10 mb-3 transition-colors ${isDragging ? "text-blue-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs font-bold text-blue-600">{config.text}</p>
              <p className="text-xs text-gray-400 mt-2">Max limit: 10MB</p>
            </div>
            <input id="file-upload" type="file" className="hidden" accept={config.accept} onChange={handleFileChange} />
          </label>
        </div>
      )}

      {selectedFile && previewUrl && (
        <div className="space-y-6">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="max-h-64 object-contain rounded-md shadow-sm mb-4" />
            <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{formatBytes(selectedFile.size)}</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label htmlFor="format-select" className="block text-sm font-medium text-gray-700 mb-1">Convert to</label>
                <select 
                  id="format-select"
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  disabled={config.locked}
                  className={`w-full border text-sm rounded-lg block p-2.5 ${
                    config.locked 
                      ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed" 
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value="image/webp">WebP</option>
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                </select>
              </div>
              <button 
                onClick={handleConvert}
                disabled={isConverting}
                className="flex-1 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors disabled:opacity-50"
              >
                {isConverting ? "Converting..." : "Convert Now"}
              </button>
            </div>

            {showQualitySlider && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="quality-slider" className="text-sm font-medium text-gray-700">Image Quality</label>
                  <span className="text-sm font-bold text-blue-600">{quality}%</span>
                </div>
                <input id="quality-slider" type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            )}
          </div>
          
          {convertedUrl && convertedSize && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col items-center">
              <div className="w-full bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Conversion Summary</h4>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-center flex-1">
                    <p className="text-gray-500 mb-1">Original Size</p>
                    <p className="font-medium text-gray-900">{formatBytes(selectedFile.size)}</p>
                  </div>
                  <div className="text-gray-300 px-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-gray-500 mb-1">Converted Size</p>
                    <p className="font-medium text-gray-900">{formatBytes(convertedSize)}</p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sizeDifference > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {sizeDifference > 0 ? `Saved ${sizeDifference.toFixed(1)}%` : `${Math.abs(sizeDifference).toFixed(1)}% Larger`}
                  </span>
                </div>
              </div>

              <a href={convertedUrl} download={downloadName} className="w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg text-sm px-5 py-3 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download {getFileExtension(targetFormat).toUpperCase()}
              </a>
            </div>
          )}

          <button onClick={() => { setSelectedFile(null); setPreviewUrl(null); setConvertedUrl(null); setConvertedSize(null); setTargetFormat(config.target); }} className="w-full text-sm text-gray-500 hover:text-gray-800 underline transition-colors mt-4">
            Upload another image
          </button>
        </div>
      )}
    </div>
  );
}

// --- Wrapper ---
function ConverterWrapper() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  
  return <ConverterContent key={mode || "default"} mode={mode} />;
}

// --- Boundary ---
export default function ImageConverter() {
  return (
    <Suspense fallback={<div className="w-full max-w-2xl mx-auto p-6 mt-10 text-center font-medium text-gray-500">Loading...</div>}>
      <ConverterWrapper />
    </Suspense>
  );
}