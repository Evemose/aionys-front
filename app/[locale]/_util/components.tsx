"use client"

import {Typography} from "@mui/material";
import {useScopedI18n} from "@/config/locales/client";


export function Timestamp({createdAt, lastModifiedAt}: { createdAt: Date, lastModifiedAt: Date }) {
    const scopedT = useScopedI18n("commons")
    return (
        <Typography variant="caption">
            {toNormalDateFormat(createdAt) +
                (+lastModifiedAt !== +createdAt ? ` (${scopedT("editedAt")} 
                ${toNormalDateFormat(lastModifiedAt)})` : "")}
        </Typography>
    )
}

// js date API is just horrible
function toNormalDateFormat(date: Date): string {
    const dateOptions = {
        hour: '2-digit', minute: '2-digit', day: "2-digit", month: "2-digit", year: "numeric",
    } as Intl.DateTimeFormatOptions
    const str = date.toLocaleDateString([], dateOptions)
    return str.replaceAll("/", ".")
}