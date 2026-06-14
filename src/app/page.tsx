"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ImageConverter from "@/components/ImageConverter";

function HomeContent() {
  // Membaca parameter 'tool' dari URL (?tool=image atau ?tool=document)
  const searchParams = useSearchParams();
  const tool = searchParams.get("tool") || "image"; // Default ke mesin image jika kosong

  return (
    <main className="flex-1 p-8 flex flex-col items-center justify-center">
      
      {/* Dynamic Header */}
      <div className="text-center mb-2 select-none">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          Qupa
        </h1>
        <p className="text-sm text-gray-500">
          {tool === "document" 
            ? "The Ultimate Document Converter" 
            : "The Ultimate Client-Side File Converter"}
        </p>
      </div>

      {/* Kondisional Rendering: Mengganti mesin berdasarkan pilihan Sidebar */}
      {tool === "document" ? (
        <div className="w-full max-w-2xl mx-auto p-12 bg-white rounded-xl shadow-sm border border-gray-200 text-center mt-10 flex flex-col items-center justify-center h-64">
          <svg className="w-12 h-12 text-gray-300 mb-4 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Document Converter Engine</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Fitur konversi dokumen (Word to PDF, PDF to JPG, dll) sedang dalam persiapan pengembangan.
          </p>
        </div>
      ) : (
        <ImageConverter />
      )}
    </main>
  );
}

// Suspense Boundary wajib digunakan karena kita membaca URL di sisi klien (Client-Side Routing)
export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Workspace...</div>}>
      <HomeContent />
    </Suspense>
  );
}