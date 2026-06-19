"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language } from "@/lib/translations";

type Theme = "light" | "dark";

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: keyof typeof translations['en']) => string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [isSidebarOpenState, setIsSidebarOpenState] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "id")) {
      // eslint-disable-next-line
      setLanguageState(savedLang);
    }

    const savedSidebar = localStorage.getItem("sidebarOpen");
    if (savedSidebar !== null) {
      setIsSidebarOpenState(savedSidebar === "true");
    }

    const isDark = document.documentElement.classList.contains("dark");
    // eslint-disable-next-line
    setThemeState(isDark ? "dark" : "light");
    
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

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

  // Safe translation function
  const t = (key: keyof typeof translations['en']): string => {
    const currentLang = mounted ? language : "en";
    return translations[currentLang][key] || String(key);
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, theme, setTheme, t, isSidebarOpen: isSidebarOpenState, setIsSidebarOpen }}>
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
