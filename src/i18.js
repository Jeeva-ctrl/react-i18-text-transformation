import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { DateTime } from "luxon";
import axios from "axios";

const loadResources = async (locale) => {
  return await axios
    .get(`/locales/${locale}/translation.json`, { params: { lang: locale } })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
const backendOptions = {
  loadPath: "{{lng}}|{{ns}}",
  request: (options, url, payload, callback) => {
    try {
      const [lng] = url.split("|");
      loadResources(lng).then((response) => {
        callback(null, {
          data: response,
          status: 200,
        });
      });
    } catch (e) {
      console.error(e);
      callback(null, {
        status: 500,
      });
    }
  },
};
i18n
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "en",
    backend: backendOptions,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: (value, format, lng) => {
        console.log("fomrat", format);
        if (value instanceof Date) {
          return DateTime.fromJSDate(value)
            .setLocale(lng)
            .toLocaleString(DateTime[format]);
        }
        return value;
      },
    },
  });

export default i18n;
