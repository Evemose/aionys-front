import React from "react";
import {I18nProviderClient} from "@/config/locales/client";
import {ThemeProvider} from "@mui/material";
import {getCurrentLocale} from "@/config/locales/server";
import theme from "@/config/theme";

export default function RootContext({children}: { children: React.ReactNode }) {
    const currentLocale = getCurrentLocale();
    return (
        <I18nProviderClient locale={currentLocale}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </I18nProviderClient>
    )
}