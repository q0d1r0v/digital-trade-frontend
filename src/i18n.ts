import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "@/locale/en/translation.json";
import uz from "@/locale/uz/translation.json";
import ru from "@/locale/ru/translation.json";

const normalizeLang = (lang: string) => {
  if (!lang) return "uz";

  const langCode = lang.toLowerCase();

  if (langCode.startsWith("uz")) return "uz";
  if (langCode.startsWith("ru")) return "ru";
  if (langCode.startsWith("en")) return "en";

  return "uz";
};

const storedLang = localStorage.getItem("i18nextLng");
const initialLang = storedLang ? normalizeLang(storedLang) : "uz";

if (!storedLang) {
  localStorage.setItem("i18nextLng", "uz");
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uz: { translation: uz },
      ru: { translation: ru },
    },
    lng: initialLang,
    fallbackLng: "uz",
    supportedLngs: ["uz", "ru", "en"],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
