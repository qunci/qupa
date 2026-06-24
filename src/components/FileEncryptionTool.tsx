"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export default function FileEncryptionTool({ mode = "encrypt" }: { mode?: "encrypt" | "decrypt" }) {
  const [internalMode, setInternalMode] = useState<"encrypt" | "decrypt">(mode);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [algorithm, setAlgorithm] = useState<"AES-GCM" | "AES-CBC">("AES-GCM");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalMode(mode);
    setFile(null);
    setPassword("");
  }, [mode]);

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = async (selectedFile: File) => {
    if (internalMode === "decrypt" && !selectedFile.name.endsWith(".locked")) {
      toast.error("Please upload a .locked file for decryption.");
      return;
    }
    setFile(selectedFile);
    setPassword("");

    if (internalMode === "decrypt") {
      try {
        const fileBuffer = await selectedFile.slice(0, 5).arrayBuffer();
        const magicCheck = new Uint8Array(fileBuffer.slice(0, 4));
        const magicStr = new TextDecoder().decode(magicCheck);
        
        if (magicStr === "QUPA") {
          const algoByte = new Uint8Array(fileBuffer.slice(4, 5))[0];
          setAlgorithm(algoByte === 0 ? "AES-GCM" : "AES-CBC");
        } else {
          setAlgorithm("AES-GCM");
        }
      } catch (e) {
        console.error("Auto-detect failed", e);
      }
    }
  };

  // --- Cryptography Engine ---
  
  const getPasswordKey = async (passwordStr: string) => {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
      "raw",
      enc.encode(passwordStr),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
  };

  const deriveKey = async (passwordKey: CryptoKey, salt: Uint8Array, algoName: string) => {
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt as BufferSource,
        iterations: 100000,
        hash: "SHA-256",
      },
      passwordKey,
      { name: algoName, length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const encryptFile = async () => {
    if (!file || !password) return;
    setIsProcessing(true);

    try {
      const fileBuffer = await file.arrayBuffer();
      
      const ivLength = algorithm === "AES-GCM" ? 12 : 16;
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(ivLength));
      
      const algoByte = new Uint8Array([algorithm === "AES-GCM" ? 0 : 1]);
      const magic = new TextEncoder().encode("QUPA");

      const passwordKey = await getPasswordKey(password);
      const aesKey = await deriveKey(passwordKey, salt, algorithm);

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: algorithm, iv: iv as BufferSource },
        aesKey,
        fileBuffer
      );

      // Package: [QUPA (4)] + [Algo (1)] + [Salt (16)] + [IV (12/16)] + [Encrypted Data]
      const encryptedBlob = new Blob([magic, algoByte, salt, iv, encryptedContent], { type: "application/octet-stream" });
      const url = URL.createObjectURL(encryptedBlob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name}.locked`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      toast.success("File secured successfully!");
      
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during securing process.");
    } finally {
      setIsProcessing(false);
    }
  };

  const decryptFile = async () => {
    if (!file || !password) return;
    setIsProcessing(true);

    try {
      const fileBuffer = await file.arrayBuffer();
      
      const magicCheck = new Uint8Array(fileBuffer.slice(0, 4));
      const magicStr = new TextDecoder().decode(magicCheck);
      
      let salt: Uint8Array;
      let iv: Uint8Array;
      let encryptedData: ArrayBuffer;
      let usedAlgorithm = "AES-GCM"; 

      if (magicStr === "QUPA") {
        const algoByte = new Uint8Array(fileBuffer.slice(4, 5))[0];
        usedAlgorithm = algoByte === 0 ? "AES-GCM" : "AES-CBC";
        const ivLength = usedAlgorithm === "AES-GCM" ? 12 : 16;
        
        if (fileBuffer.byteLength < 5 + 16 + ivLength) {
           throw new Error("Invalid file format");
        }
        
        salt = new Uint8Array(fileBuffer.slice(5, 21));
        iv = new Uint8Array(fileBuffer.slice(21, 21 + ivLength));
        encryptedData = fileBuffer.slice(21 + ivLength);
      } else {
        if (fileBuffer.byteLength < 28) {
          throw new Error("Invalid file format");
        }
        salt = new Uint8Array(fileBuffer.slice(0, 16));
        iv = new Uint8Array(fileBuffer.slice(16, 28));
        encryptedData = fileBuffer.slice(28);
      }
      
      setAlgorithm(usedAlgorithm as any);

      const passwordKey = await getPasswordKey(password);
      const aesKey = await deriveKey(passwordKey, salt, usedAlgorithm);

      let decryptedContent;
      try {
        decryptedContent = await window.crypto.subtle.decrypt(
          { name: usedAlgorithm, iv: iv as BufferSource },
          aesKey,
          encryptedData
        );
      } catch (e) {
        toast.error("Incorrect password or corrupted file.");
        setIsProcessing(false);
        return;
      }

      const decryptedBlob = new Blob([decryptedContent], { type: "application/octet-stream" });
      const url = URL.createObjectURL(decryptedBlob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.endsWith(".locked") ? file.name.slice(0, -7) : `decrypted_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      toast.success("File decrypted successfully!");
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to decrypt the file. Ensure it is a valid .locked file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isEncrypt = internalMode === "encrypt";
  
  const dragActiveClasses = isEncrypt 
    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-400" 
    : "border-sky-500 bg-sky-50 dark:bg-sky-500/10 dark:border-sky-400";
    
  const iconWrapperClasses = isEncrypt
    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
    : "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400";
    
  const inputFocusClasses = isEncrypt
    ? "focus:ring-emerald-500 focus:border-emerald-500"
    : "focus:ring-sky-500 focus:border-sky-500";
    
  const buttonActiveClasses = isEncrypt
    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg"
    : "bg-sky-600 text-white hover:bg-sky-700 shadow-md hover:shadow-lg";

  const icon = isEncrypt ? (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
  ) : (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
  );

  return (
    <div className="w-full flex flex-col space-y-6 animate-in fade-in duration-500 h-full">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-[#18181B] rounded-xl border border-slate-200 dark:border-slate-800 w-fit self-center xl:self-start">
        <button
          onClick={() => { setInternalMode("encrypt"); setFile(null); }}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${isEncrypt ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Secure File
        </button>
        <button
          onClick={() => { setInternalMode("decrypt"); setFile(null); }}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${!isEncrypt ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Unlock File
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full flex-1 min-h-0">
        <div className="flex flex-col h-full">
          {!file ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-full min-h-[20rem] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                isDragging 
                  ? dragActiveClasses
                  : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-[#18181B]"
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconWrapperClasses}`}>
                {icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {isEncrypt ? "Select File to Secure" : "Select File to Unlock"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {isEncrypt ? "Drag & drop any file here" : "Drag & drop a .locked file here"}
              </p>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept={!isEncrypt ? ".locked" : "*"} 
                className="hidden" 
                onChange={(e) => e.target.files && e.target.files.length > 0 && handleFileSelection(e.target.files[0])} 
              />
            </div>
          ) : (
            <div className="bg-white dark:bg-[#18181B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`w-12 h-12 shrink-0 rounded-lg flex items-center justify-center ${iconWrapperClasses}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{file.name}</h3>
                    <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)} 
                  className="text-sm text-slate-500 hover:text-red-500 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shrink-0 ml-4 transition-colors"
                >
                  Change File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col w-full bg-white dark:bg-[#1C1C1E] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full min-h-[20rem]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Security Settings</h3>
          
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as "AES-GCM" | "AES-CBC")}
                disabled={isProcessing || !isEncrypt}
                className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 transition-colors ${inputFocusClasses} ${!isEncrypt ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <option value="AES-GCM">AES-256-GCM (Recommended)</option>
                <option value="AES-CBC">AES-256-CBC</option>
              </select>
              {!isEncrypt && (
                <p className="text-[11px] text-slate-500 mt-1.5">Auto-detected from file</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                {isEncrypt ? "Set Password" : "Enter Password"}
                {isEncrypt && (
                  <div className="relative group flex items-center">
                    <svg className="w-3 h-3 text-amber-500 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-800 dark:bg-slate-700 text-slate-100 text-[11px] rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-10 text-center font-medium leading-relaxed">
                      Important: Keep this password safe. If you forget it, your file cannot be recovered!
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
                    </div>
                  </div>
                )}
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 transition-colors ${inputFocusClasses}`}
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="mt-auto pt-8">
            <button 
              onClick={isEncrypt ? encryptFile : decryptFile}
              disabled={!file || !password || isProcessing}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !file || !password || isProcessing
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : buttonActiveClasses
              }`}
            >
              {isProcessing ? (
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : isEncrypt ? (
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> Secure File</>
              ) : (
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg> Unlock File</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
