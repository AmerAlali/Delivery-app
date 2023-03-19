import { tr, ar } from "../languages/supportedLangauges";
import { I18n } from "i18n-js";


export const useLanguage = () => {
    const translations = {
        tr,
        ar,
      };
      const i18n = new I18n(translations);
      
      // Set the locale once at the beginning of your app.
      i18n.locale = "tr";
      
      // When a value is missing from a language it'll fall back to another language with the key present.
      i18n.enableFallback = true;
  const setLangauge = (langauge) => {
    i18n.locale = langauge;
  };

  return { i18n, setLangauge };
};
