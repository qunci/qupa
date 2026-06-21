"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Image as ImageIcon, Archive, Lock, Unlock, Settings, Home, ArrowRight, CornerDownLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToolItem = {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  href: string;
};

const searchData: ToolItem[] = [
  { id: "dashboard", name: "Dashboard", category: "Navigation", icon: <Home className="w-5 h-5" />, href: "/?hub=dashboard" },
  { id: "settings", name: "Settings", category: "Navigation", icon: <Settings className="w-5 h-5" />, href: "/?hub=settings" },
  { id: "merge-pdf", name: "Merge PDF", category: "Document Tools", icon: <FileText className="w-5 h-5 text-amber-500" />, href: "/?hub=dashboard&tool=merge-pdf" },
  { id: "split-pdf", name: "Split PDF", category: "Document Tools", icon: <FileText className="w-5 h-5 text-rose-500" />, href: "/?hub=dashboard&tool=split-pdf" },
  { id: "convert-document", name: "Document Converter", category: "Document Tools", icon: <FileText className="w-5 h-5 text-indigo-500" />, href: "/?hub=dashboard&tool=convert-document" },
  { id: "convert-image", name: "Image Converter", category: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-blue-500" />, href: "/?hub=dashboard&tool=convert-image" },
  { id: "compress-image", name: "Image Compressor", category: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-teal-500" />, href: "/?hub=dashboard&tool=compress-image" },
  { id: "compress-file", name: "Compress to ZIP", category: "File Utilities", icon: <Archive className="w-5 h-5 text-indigo-500" />, href: "/?hub=dashboard&tool=compress-file" },
  { id: "extract-archive", name: "Extract Archive", category: "File Utilities", icon: <Archive className="w-5 h-5 text-fuchsia-500" />, href: "/?hub=dashboard&tool=extract-archive" },
  { id: "encrypt-file", name: "Encrypt File", category: "File Utilities", icon: <Lock className="w-5 h-5 text-emerald-500" />, href: "/?hub=dashboard&tool=encrypt-file" },
  { id: "decrypt-file", name: "Decrypt File", category: "File Utilities", icon: <Unlock className="w-5 h-5 text-sky-500" />, href: "/?hub=dashboard&tool=decrypt-file" },
];

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter and sort items based on query relevance
  const filteredItems = searchData
    .map((item, index) => {
      if (!query) return { item, score: 0, index };
      
      const searchStr = query.toLowerCase();
      const nameLower = item.name.toLowerCase();
      const categoryLower = item.category.toLowerCase();
      
      let score = 0;
      
      // Exact and substring matches
      if (nameLower === searchStr) score += 100;
      else if (nameLower.startsWith(searchStr)) score += 50;
      else if (nameLower.includes(` ${searchStr}`)) score += 30;
      else if (nameLower.includes(searchStr)) score += 10;
      
      // Category matches
      if (categoryLower === searchStr) score += 8;
      else if (categoryLower.startsWith(searchStr)) score += 4;
      else if (categoryLower.includes(` ${searchStr}`)) score += 2;
      else if (categoryLower.includes(searchStr)) score += 1;

      // Fuzzy subsequence match (e.g. "se" in "Split PDF")
      let fuzzyIdx = 0;
      for (let i = 0; i < nameLower.length; i++) {
        if (nameLower[i] === searchStr[fuzzyIdx]) {
          fuzzyIdx++;
          score += 2; // points for sequence progression
          if (fuzzyIdx === searchStr.length) {
            score += 5; // Bonus for full subsequence match
            break;
          }
        }
      }

      // Character overlap score (fallback for partial non-sequential matches)
      for (const char of searchStr) {
        if (nameLower.includes(char)) {
          score += 1;
        }
      }

      return { item, score, index };
    })
    // Do NOT filter out items. Keep everything, just sort.
    .sort((a, b) => {
      if (!query) return a.index - b.index;
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    })
    .map((x) => x.item);

  // Group by category (only visually useful when query is empty)
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ToolItem[]>);

  // Flatten for keyboard navigation
  const flatFilteredItems = query ? filteredItems : Object.values(groupedItems).flat();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    // Listen for custom event from trigger button
    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-global-search", handleOpenEvent);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-global-search", handleOpenEvent);
    };
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      // Timeout needed to focus correctly after framer-motion render
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle keyboard navigation inside the modal
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < flatFilteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedItem = flatFilteredItems[selectedIndex];
      if (selectedItem) {
        handleSelect(selectedItem.href);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Ensure selected item stays in view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector('[data-selected="true"]') as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-xl bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-200/50 dark:border-slate-700/50 flex flex-col max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="relative flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleModalKeyDown}
                  placeholder="Search tools, settings, or workspaces..."
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-700 dark:text-slate-200 text-lg px-3 placeholder:text-slate-400/80 dark:placeholder:text-slate-500"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="shrink-0 p-1.5 md:px-2 md:py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Close search"
                >
                  <span className="hidden md:inline">ESC</span>
                  <X className="w-4 h-4 md:hidden" />
                </button>
              </div>

              {/* Results List Wrapper */}
              <div className="flex-1 overflow-hidden p-2 flex flex-col">
                <div 
                  ref={listRef}
                  className="overflow-y-auto scrollbar-hide flex-1 space-y-1"
                >
                  {flatFilteredItems.length === 0 ? (
                    <div className="py-14 text-center text-slate-500 dark:text-slate-400">
                      <p>No results found for "{query}"</p>
                    </div>
                  ) : !query ? (
                    // Grouped view when NOT searching
                    Object.entries(groupedItems).map(([category, items]) => (
                      <div key={category} className="mb-2 last:mb-0">
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {category}
                        </div>
                        <div className="space-y-0.5">
                          {items.map((item) => {
                            const globalIndex = flatFilteredItems.findIndex(i => i.id === item.id);
                            const isSelected = globalIndex === selectedIndex;
                            
                            return (
                              <button
                                key={item.id}
                                data-selected={isSelected}
                                onClick={() => handleSelect(item.href)}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                                  isSelected 
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white dark:bg-blue-900/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                    {item.icon}
                                  </div>
                                  <span className="font-medium text-[15px]">{item.name}</span>
                                </div>
                                {isSelected && (
                                  <CornerDownLeft className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Flat sorted view when searching
                    <div className="space-y-0.5">
                      {flatFilteredItems.map((item, globalIndex) => {
                        const isSelected = globalIndex === selectedIndex;
                        return (
                          <button
                            key={item.id}
                            data-selected={isSelected}
                            onClick={() => handleSelect(item.href)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                              isSelected 
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white dark:bg-blue-900/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                {item.icon}
                              </div>
                              <span className="font-medium text-[15px]">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[11px] font-medium tracking-wide ${isSelected ? 'text-blue-400/80 dark:text-blue-300/70' : 'text-slate-400/70 dark:text-slate-500/70'}`}>
                                {item.category}
                              </span>
                              {isSelected && (
                                <CornerDownLeft className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="hidden md:flex px-4 py-3 bg-slate-50 dark:bg-[#131415] border-t border-slate-100 dark:border-slate-800 items-center justify-center gap-6 text-[11px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">↓</kbd>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">↵</kbd>
                  <span>to select</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">esc</kbd>
                  <span>to close</span>
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
