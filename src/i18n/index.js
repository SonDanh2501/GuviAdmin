import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import vi from "./vi.json";
import en from "./en.json";
import { getLanguageState } from "../redux/selectors/auth";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    fallbackLng: ["vi", "en"],

    lng: "vi",
    // keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
