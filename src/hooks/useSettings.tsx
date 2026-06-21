"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { translations, Language } from "@/lib/translations";

type Theme = "light" | "dark";

interface SettingsContextType {
  language: Language;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [isSidebarOpenState, setIsSidebarOpenState] = useState<boolean>(true);
  const [recentToolsState, setRecentToolsState] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSidebar = localStorage.getItem("sidebarOpen");
    if (savedSidebar !== null) {
      setIsSidebarOpenState(savedSidebar === "true");
    } else {
      setIsSidebarOpenState(window.innerWidth >= 1024);
    }

    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
    
    const savedRecentTools = localStorage.getItem("recentTools");
    if (savedRecentTools !== null) {
      try {
        setRecentToolsState(JSON.parse(savedRecentTools));
      } catch (e) {}
    }

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

  const t = (key: keyof typeof translations['en']): string => {
    const currentLang = mounted ? language : "en";
    return translations[currentLang][key] || String(key);
  };

  const addRecentTool = useCallback((toolId: string) => {
    setRecentToolsState(prev => {
      // Don't update state if it's already at the front
      if (prev.length > 0 && prev[0] === toolId) return prev;
      
      const filtered = prev.filter(t => t !== toolId);
      const newTools = [toolId, ...filtered].slice(0, 5);
      localStorage.setItem("recentTools", JSON.stringify(newTools));
      return newTools;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ language, theme, setTheme, t, isSidebarOpen: isSidebarOpenState, setIsSidebarOpen, recentTools: recentToolsState, addRecentTool }}>
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
