import { useLanguage } from '../context/LanguageContext.jsx';

export function useLocalizedContent() {
  const { language } = useLanguage();

  const localize = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return value;
    }
    return value[language] || value.en || Object.values(value)[0];
  };

  return { language, localize };
}
