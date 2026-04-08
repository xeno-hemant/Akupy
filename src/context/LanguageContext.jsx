import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en';
import hi from '../translations/hi';

const TRANSLATIONS = { en, hi };
const STORAGE_KEY = 'akupy_lang';

const LanguageContext = createContext({
    lang: 'en',
    setLang: () => {},
    t: (key) => key,
});

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en');

    const setLang = (newLang) => {
        localStorage.setItem(STORAGE_KEY, newLang);
        setLangState(newLang);
    };

    // Translation function — falls back to English if key missing in Hindi
    const t = (key) => {
        return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS['en']?.[key] ?? key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export default LanguageContext;
