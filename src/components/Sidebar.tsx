"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SidebarContent() {
  const searchParams = useSearchParams();
  const currentTool = searchParams.get("tool") || "image"; // Default ke image

  // Helper untuk styling menu yang aktif
  const getMenuClass = (toolName: string) => {
    const isActive = currentTool === toolName;
    return `w-full flex items-center gap-3 p-3 text-sm font-semibold rounded-lg transition-colors ${
      isActive 
        ? "text-blue-700 bg-blue-50 border border-blue-100" 
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent"
    }`;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-xl font-bold tracking-tight text-gray-900">Qupa</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-2 text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">
          Conversion Tools
        </p>

        {/* Image Converter Tool */}
        <Link href="/?tool=image" className={getMenuClass("image")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Image Converter</span>
        </Link>

        {/* Document Converter Tool */}
        <Link href="/?tool=document" className={getMenuClass("document")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Document Converter</span>
        </Link>
      </nav>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 bg-white border-r h-screen" />}>
      <SidebarContent />
    </Suspense>
  );
}