import {createI18nClient} from "next-international/client";

const locales = [{
    locale: "en",
    name: "English"
}, {
    locale: "uk",
    name: "Українська",
}];

const defaultLocale = "en";

export {
    locales,
    defaultLocale
};