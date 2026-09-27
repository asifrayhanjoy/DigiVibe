"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale } from "@/types";
import { DICTIONARIES, getDictionary } from "@/lib/i18n/dictionaries";

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  dict: typeof DICTIONARIES["en"];
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  dict: DICTIONARIES.en,
});

export const LanguageProvider = ({
  children,
  initialLocale = "en"
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const saved = localStorage.getItem("digivibe_locale") as Locale;
    if (saved && (saved === "en" || saved === "bn")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    localStorage.setItem("digivibe_locale", loc);
  };

  const dict = getDictionary(locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dict }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
