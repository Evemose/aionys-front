"use client"

import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {locales} from "@/config/locales/locales";
import {useChangeLocale, useCurrentLocale, useScopedI18n} from "@/config/locales/client"
import {useWindowSize} from "@/app/[locale]/_util/hooks";
import {breakpoints} from "@/config/theme";

export default function LanguageSelector() {
    const changeLocale = useChangeLocale();
    const currentLocale = useCurrentLocale();
    const scopedT = useScopedI18n("languageSelector");

    return (
        <FormControl className={`${useWindowSize()[0] > breakpoints.values.md ? "w-1/12" : "w/1.3"}`} size="small">
            <InputLabel id="language-label">{scopedT("language")}</InputLabel>
            <Select
                labelId="language-label"
                id="language-select"
                value={currentLocale}
                label={scopedT("language")}
                onChange={
                    (e) => changeLocale(e.target.value as "en" | "uk")
                }
            >
                {
                    locales.map((lang) =>
                        <MenuItem key={lang.locale} value={lang.locale}>
                            {lang.name}
                        </MenuItem>
                    )
                }
            </Select>
        </FormControl>
    )
}