"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";
import { ZipReader, ZipWriter, BlobReader, BlobWriter } from "@zip.js/zip.js";
import { Archive } from "libarchive.js";

Archive.init({
  workerUrl: "/libarchive.js/worker-bundle.js"
});

interface ZipEntryInfo {
  filename: string;
  compressedSize: number;
  uncompressedSize: number;
  encrypted: boolean;
  directory: boolean;
  entry: any; // the actual zip.js Entry object or libarchive CompressedFile
  isWasm?: boolean;
  archiveObj?: any; // reference to Archive instance for password
}

export default function ArchiveTool() {
  const [mode, setMode] = useState<"compress" | "extract">("compress");
  
  // Compress State
  const [filesToZip, setFilesToZip] = useState<File[]>([]);
  const [zipPassword, setZipPassword] = useState("");
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  // Extract State
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [zipEntries, setZipEntries] = useState<ZipEntryInfo[]>([]);
  const [extractPassword, setExtractPassword] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState({ current: 0, total: 0 });
  const [needsPassword, setNeedsPassword] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCompressDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFilesToZip(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleExtractDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadZipFile(e.dataTransfer.files[0]);
    }
  };

  const loadZipFile = async (file: File) => {
    const isZip = file.name.toLowerCase().endsWith(".zip") || file.type.includes("zip");
    const allowedExtensions = [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2"];
    const ext = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
    
    if (!ext || !allowedExtensions.includes(ext)) {
      toast.error("Please upload a supported archive file (.zip, .rar, .7z, .tar, .gz)");
      return;
    }

    setZipFile(file);
    setExtractPassword("");
    try {
      if (isZip) {
        const zipReader = new ZipReader(new BlobReader(file));
        const entries = await zipReader.getEntries();
        
        const parsedEntries: ZipEntryInfo[] = entries.map(e => ({
          filename: e.filename,
          compressedSize: e.compressedSize,
          uncompressedSize: e.uncompressedSize,
          encrypted: e.encrypted,
          directory: e.directory,
          entry: e
        }));
        
        setZipEntries(parsedEntries);
        setNeedsPassword(parsedEntries.some(e => e.encrypted));
        await zipReader.close();
      } else {
        // WASM libarchive handling
        const archive = await Archive.open(file);
        const isEncrypted = await archive.hasEncryptedData();
        setNeedsPassword(isEncrypted === true);

        const fileArray = await archive.getFilesArray();
        const parsedEntries: ZipEntryInfo[] = fileArray.map((item: any) => ({
          filename: item.path + item.file.name,
          compressedSize: 0,
          uncompressedSize: item.file.size || 0,
          encrypted: isEncrypted === true,
          directory: false, // getFilesArray only returns files
          entry: item.file,
          isWasm: true,
          archiveObj: archive
        }));
        
        setZipEntries(parsedEntries);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to read the archive file. It might be corrupted.");
      setZipFile(null);
      setZipEntries([]);
    }
  };

  const createZip = async () => {
    if (filesToZip.length === 0) return;
    setIsZipping(true);
    setZipProgress(0);

    try {
      const blobWriter = new BlobWriter("application/zip");
      const zipWriter = new ZipWriter(blobWriter, { 
        password: zipPassword.trim() !== "" ? zipPassword : undefined 
      });

      for (let i = 0; i < filesToZip.length; i++) {
        const file = filesToZip[i];
        await zipWriter.add(file.name, new BlobReader(file), {
          onprogress: (index, max) => {
            // roughly calculate overall progress
            const fileProgress = index / max;
            const overallProgress = ((i + fileProgress) / filesToZip.length) * 100;
            setZipProgress(Math.round(overallProgress));
          }
        });
      }

      const zipBlob = await zipWriter.close();
      const url = URL.createObjectURL(zipBlob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `Archive_${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      toast.success("ZIP created successfully!");
      
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating the ZIP");
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  const extractZip = async () => {
    if (!zipFile || zipEntries.length === 0) return;
    
    // Check if password is provided if needed
    if (needsPassword && !extractPassword) {
      toast.error("This ZIP file is encrypted. Please provide a password.");
      return;
    }

    try {
      // Use File System Access API if available
      let dirHandle: any = null;
      if ('showDirectoryPicker' in window) {
        try {
          dirHandle = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
        } catch (e) {
          // user cancelled picker
          return;
        }
      } else {
        toast.warning("Browser doesn't support folder selection. Files will be downloaded individually.");
      }

      setIsExtracting(true);
      const filesToExtract = zipEntries.filter(e => !e.directory);
      setExtractProgress({ current: 0, total: filesToExtract.length });

      for (let i = 0; i < filesToExtract.length; i++) {
        const item = filesToExtract[i];
        
        try {
          let blob: Blob;
          if (item.isWasm) {
            if (needsPassword && extractPassword) {
              await item.archiveObj.usePassword(extractPassword);
            }
            blob = await item.entry.extract(); // Returns a File object which is a Blob
          } else {
            const blobWriter = new BlobWriter();
            blob = await item.entry.getData(blobWriter, {
              password: extractPassword || undefined
            });
          }

          if (dirHandle) {
            // create subdirectories if needed
            const parts = item.filename.split('/');
            const filename = parts.pop();
            let currentDir = dirHandle;
            
            for (const part of parts) {
              currentDir = await currentDir.getDirectoryHandle(part, { create: true });
            }
            
            const fileHandle = await currentDir.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
          } else {
            // fallback to manual download
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = item.filename.split('/').pop() || item.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
          }
          
          setExtractProgress({ current: i + 1, total: filesToExtract.length });
        } catch (err: any) {
          if (err.message?.toLowerCase().includes("password")) {
            toast.error("Incorrect password for extraction.");
            setIsExtracting(false);
            return;
          }
          throw err;
        }
      }

      toast.success("Extraction complete!");

    } catch (err) {
      console.error(err);
      toast.error("Failed to extract files. Corrupted ZIP or incorrect password.");
    } finally {
      setIsExtracting(false);
    }
  };

  const removeFileToZip = (index: number) => {
    setFilesToZip(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      
      {/* Mode Switcher */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full max-w-md mx-auto mb-8">
        <button 
          onClick={() => setMode("compress")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'compress' ? 'bg-white dark:bg-[#18181B] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Compress to ZIP
        </button>
        <button 
          onClick={() => setMode("extract")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'extract' ? 'bg-white dark:bg-[#18181B] text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Extract Files
        </button>
      </div>

      {mode === "compress" ? (
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-4">
            
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleCompressDrop}
              onClick={() => filesToZip.length === 0 && fileInputRef.current?.click()}
              className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${filesToZip.length === 0 ? 'cursor-pointer' : ''} ${
                isDragging 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400" 
                  : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-[#18181B]"
              }`}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Add Files to ZIP</h3>
              <p className="text-xs text-slate-500 mt-1">Drag & drop files here</p>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && setFilesToZip(prev => [...prev, ...Array.from(e.target.files!)])} />
            </div>

            {filesToZip.length > 0 && (
              <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Files Queue ({filesToZip.length})</h3>
                  <button onClick={() => setFilesToZip([])} className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded">Clear All</button>
                </div>
                <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                  {filesToZip.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 whitespace-nowrap">{formatBytes(file.size)}</span>
                        <button onClick={() => removeFileToZip(idx)} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compress Controls */}
          <div className="w-full xl:w-80 flex flex-col shrink-0 bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">ZIP Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password (Optional)</label>
                <input 
                  type="password"
                  value={zipPassword}
                  onChange={(e) => setZipPassword(e.target.value)}
                  placeholder="Leave empty for no password"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isZipping}
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {isZipping && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    <span>Compressing...</span>
                    <span>{zipProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${zipProgress}%` }}></div>
                  </div>
                </div>
              )}

              <button 
                onClick={createZip}
                disabled={filesToZip.length === 0 || isZipping}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  filesToZip.length === 0 || isZipping
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Create & Download ZIP
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-4">
            
            {!zipFile ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleExtractDrop}
                onClick={() => zipInputRef.current?.click()}
                className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                  isDragging 
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-400" 
                    : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-[#18181B]"
                }`}
              >
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Open Archive File</h3>
                <p className="text-sm text-slate-500 mt-1">Drag & drop a .zip, .rar, .7z here</p>
                <input ref={zipInputRef} type="file" accept=".zip,application/zip,.rar,.7z,.tar,.gz,.bz2" className="hidden" onChange={(e) => e.target.files && e.target.files.length > 0 && loadZipFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="bg-white dark:bg-[#18181B] border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{zipFile.name}</h3>
                      <p className="text-xs text-slate-500">{formatBytes(zipFile.size)} • {zipEntries.length} items</p>
                    </div>
                  </div>
                  <button onClick={() => { setZipFile(null); setZipEntries([]); }} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
                    Close
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto pr-2 space-y-1">
                  {zipEntries.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {entry.directory ? (
                          <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                        ) : (
                          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{entry.filename}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {entry.encrypted && <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><title>Encrypted</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                        {!entry.directory && <span className="text-xs text-slate-400 whitespace-nowrap">{formatBytes(entry.uncompressedSize)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Extract Controls */}
          {zipFile && (
            <div className="w-full xl:w-80 flex flex-col shrink-0 bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Extraction Details</h3>
              
              <div className="space-y-4">
                {needsPassword && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-xl">
                    <label className="block text-sm font-bold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Password Required
                    </label>
                    <input 
                      type="password"
                      value={extractPassword}
                      onChange={(e) => setExtractPassword(e.target.value)}
                      placeholder="Enter password to extract"
                      className="w-full p-2.5 border border-orange-300 dark:border-orange-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      disabled={isExtracting}
                    />
                  </div>
                )}
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Browser will ask you to select a folder where files will be extracted. If your browser doesn't support folder selection, files will be downloaded individually.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {isExtracting && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      <span>Extracting...</span>
                      <span>{extractProgress.current} / {extractProgress.total}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(extractProgress.current / extractProgress.total) * 100}%` }}></div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={extractZip}
                  disabled={isExtracting || (needsPassword && !extractPassword)}
                  className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isExtracting || (needsPassword && !extractPassword)
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Extract All
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
