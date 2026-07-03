'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLang, languages, languageNames, localeStrings } from './i18n';

const LanguageContext = createContext({
  lang: defaultLang,
  setLang: () => {},
  t: (key) => localeStrings[defaultLang][key] || key,
  languageNames,
});

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    const stored = window.localStorage.getItem('audit-lang');
    if (stored && languages.includes(stored)) {
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('audit-lang', lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key) => localeStrings[lang]?.[key] || localeStrings[defaultLang]?.[key] || key,
      languageNames,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
