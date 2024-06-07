"use client"

import {InputLabel, MenuItem, Select} from "@mui/material";
import {FormControl} from "@mui/material";
import {locales} from "@/config/locales/locales";
import {useChangeLocale, useCurrentLocale} from "@/config/locales/client"

export default function LanguageSelector() {
    const changeLocale = useChangeLocale();
    const currentLocale = useCurrentLocale();

    return (
        <FormControl className="w-1/12" size="small">
            <InputLabel id="language-label">Language</InputLabel>
            <Select
                labelId="language-label"
                id="language"
                value={currentLocale}
                label="Language"
                onChange={
                (e) => {
                    console.log(e.target.value)
                    changeLocale(e.target.value as "en" | "uk")
                }
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