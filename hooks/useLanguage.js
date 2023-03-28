import { tr, ar, en } from "../languages/supportedLangauges";
import { I18n } from "i18n-js";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLanguage = () => {
  const translations = {
    tr,
    ar,
    en,
  };
  const i18n = new I18n(translations);
  i18n.enableFallback = true;
  const [locale, setLocale] = useState("");
  const setLanguage = async (language) => {
    AsyncStorage.setItem("DefaultLanguage", language);
    setLocale(language); // update the state variable when the language is changed
  };
  i18n.locale = locale;

  return { i18n, setLanguage };
};
