import { createI18nServer } from "next-international/server";

const locales = {
    en: () => import("./dicts/en"),
    uk: () => import("./dicts/uk"),
};

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } =
    createI18nServer<typeof locales, { en: any; uk: any }>(locales);