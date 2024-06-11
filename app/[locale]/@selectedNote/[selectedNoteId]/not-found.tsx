"use client"

import {useScopedI18n} from "@/config/locales/client";
import {Typography} from "@mui/material";
import {Container} from "@/app/[locale]/@selectedNote/[selectedNoteId]/container";

export default function ErrorSelectedNote() {
    const scopedT = useScopedI18n("selectedNoteError")
    return (
        <Container styles="flex items-center justify-center">
            <Typography variant="h1" color="gray">{scopedT("noteNotFound")}</Typography>
        </Container>
    )
}