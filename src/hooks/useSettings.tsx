"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language } from "@/lib/translations";

type Theme = "light" | "dark";

interface SettingsContextType {
  language: Language;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: keyof typeof translations['en']) => string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  pinnedTools: string[];
  togglePinTool: (toolId: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [isSidebarOpenState, setIsSidebarOpenState] = useState<boolean>(true);
  const [pinnedTools, setPinnedToolsState] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSidebar = localStorage.getItem("sidebarOpen");
    if (savedSidebar !== null) {
      setIsSidebarOpenState(savedSidebar === "true");
    } else {
      setIsSidebarOpenState(window.innerWidth >= 1024);
    }

    const savedPinnedTools = localStorage.getItem("pinnedTools");
    if (savedPinnedTools) {
      try {
        setPinnedToolsState(JSON.parse(savedPinnedTools));
      } catch (e) {
        console.error("Failed to parse pinned tools from localStorage", e);
      }
    }

    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
    
    setMounted(true);
  }, []);



  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setIsSidebarOpen = (isOpen: boolean) => {
    setIsSidebarOpenState(isOpen);
    localStorage.setItem("sidebarOpen", String(isOpen));
  };

  const togglePinTool = (toolId: string) => {
    setPinnedToolsState(prev => {
      const isPinned = prev.includes(toolId);
      const newPinned = isPinned ? prev.filter(id => id !== toolId) : [...prev, toolId];
      localStorage.setItem("pinnedTools", JSON.stringify(newPinned));
      return newPinned;
    });
  };

  const t = (key: keyof typeof translations['en']): string => {
    const currentLang = mounted ? language : "en";
    return translations[currentLang][key] || String(key);
  };

  return (
    <SettingsContext.Provider value={{ language, theme, setTheme, t, isSidebarOpen: isSidebarOpenState, setIsSidebarOpen, pinnedTools, togglePinTool }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
