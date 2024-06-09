"use client"

import {Typography} from "@mui/material";
import {useScopedI18n} from "@/config/locales/client";
import React from "react";
import {toNormalDateFormat} from "@/app/[locale]/_util/misc";


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

