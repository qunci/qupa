"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

export default function FileEncryptionTool({ mode }: { mode: "encrypt" | "decrypt" }) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelection = (selectedFile: File) => {
    if (mode === "decrypt" && !selectedFile.name.endsWith(".locked")) {
      toast.error("Please upload a .locked file for decryption.");
      return;
    }
    setFile(selectedFile);
    setPassword("");
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

  const deriveKey = async (passwordKey: CryptoKey, salt: Uint8Array) => {
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const encryptFile = async () => {
    if (!file || !password) return;
    setIsProcessing(true);

    try {
      const fileBuffer = await file.arrayBuffer();
      
      // Generate secure random salt and IV
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const passwordKey = await getPasswordKey(password);
      const aesKey = await deriveKey(passwordKey, salt);

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        aesKey,
        fileBuffer
      );

      // Construct final package: [Salt (16)] + [IV (12)] + [Encrypted Data]
      const encryptedBlob = new Blob([salt, iv, encryptedContent], { type: "application/octet-stream" });
      const url = URL.createObjectURL(encryptedBlob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name}.locked`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      toast.success("File encrypted successfully!");
      
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during encryption.");
    } finally {
      setIsProcessing(false);
    }
  };

  const decryptFile = async () => {
    if (!file || !password) return;
    setIsProcessing(true);

    try {
      const fileBuffer = await file.arrayBuffer();
      
      // File must be at least 16 (salt) + 12 (iv) bytes long
      if (fileBuffer.byteLength < 28) {
        throw new Error("Invalid file format");
      }

      // Extract Salt, IV, and the encrypted data
      const salt = new Uint8Array(fileBuffer.slice(0, 16));
      const iv = new Uint8Array(fileBuffer.slice(16, 28));
      const encryptedData = fileBuffer.slice(28);

      const passwordKey = await getPasswordKey(password);
      const aesKey = await deriveKey(passwordKey, salt);

      let decryptedContent;
      try {
        decryptedContent = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv: iv },
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
      // Remove '.locked' from the filename
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

  const isEncrypt = mode === "encrypt";
  
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
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-4">
          
          {!file ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                isDragging 
                  ? dragActiveClasses
                  : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-[#18181B]"
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconWrapperClasses}`}>
                {icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {isEncrypt ? "Select File to Encrypt" : "Select File to Decrypt"}
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
            <div className="bg-white dark:bg-[#18181B] border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
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
        <div className="w-full xl:w-80 flex flex-col shrink-0 bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Security Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                {isEncrypt ? "Set Password" : "Enter Password"}
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
            
            {isEncrypt && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                  Important: Keep this password safe. If you forget it, your file cannot be recovered!
                </p>
              </div>
            )}
          </div>

          <div className="mt-8">
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
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> Lock File</>
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
