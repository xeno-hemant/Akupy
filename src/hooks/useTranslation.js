import { useLanguage } from '../context/LanguageContext';

/**
 * useTranslation — hook that returns the t() function from LanguageContext.
 * Usage: const { t } = useTranslation();  →  t('addToCart')
 */
export default function useTranslation() {
    const { t, lang, setLang } = useLanguage();
    return { t, lang, setLang };
}
