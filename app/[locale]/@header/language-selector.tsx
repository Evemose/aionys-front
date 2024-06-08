"use client"

import {InputLabel, MenuItem, Select} from "@mui/material";
import {FormControl} from "@mui/material";
import {locales} from "@/config/locales/locales";
import {useChangeLocale, useCurrentLocale, useScopedI18n} from "@/config/locales/client"

export default function LanguageSelector() {
    const changeLocale = useChangeLocale();
    const currentLocale = useCurrentLocale();
    const scopedT = useScopedI18n("languageSelector");

    return (
        <FormControl className="w-1/12" size="small">
            <InputLabel id="language-label">{scopedT("language")}</InputLabel>
            <Select
                labelId="language-label"
                id="language"
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