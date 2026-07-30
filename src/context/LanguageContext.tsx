import React, { createContext, useContext, useState, useEffect } from 'react';
import { TOP_40_LANGUAGES, LanguageItem } from '../data/languages';
import { getTranslation } from '../lib/translations';

interface LanguageContextType {
  selectedLanguage: LanguageItem;
  setSelectedLanguage: (lang: LanguageItem) => void;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{
  initialLanguage?: LanguageItem;
  onLanguageChangeExternal?: (lang: LanguageItem) => void;
  children: React.ReactNode;
}> = ({ initialLanguage, onLanguageChangeExternal, children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<LanguageItem>(
    initialLanguage || TOP_40_LANGUAGES[0]
  );

  useEffect(() => {
    if (initialLanguage && initialLanguage.code !== selectedLanguage.code) {
      setSelectedLanguageState(initialLanguage);
    }
  }, [initialLanguage]);

  const handleSetSelectedLanguage = (lang: LanguageItem) => {
    setSelectedLanguageState(lang);
    if (onLanguageChangeExternal) {
      onLanguageChangeExternal(lang);
    }
  };

  const t = (key: string, defaultText?: string): string => {
    return getTranslation(key, selectedLanguage.code, defaultText);
  };

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage: handleSetSelectedLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if component is used outside provider
    return {
      selectedLanguage: TOP_40_LANGUAGES[0],
      setSelectedLanguage: () => {},
      t: (key: string, defaultText?: string) => defaultText || key
    };
  }
  return context;
};
