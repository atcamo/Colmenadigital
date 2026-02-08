
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('bee_lang');
    return (saved as Language) || 'es';
  });

  useEffect(() => {
    localStorage.setItem('bee_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Función simple para acceder a traducciones anidadas (ej: "hero.title")
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Devuelve la clave si no encuentra la traducción
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
