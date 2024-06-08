import "@/static/styles.css";
import React from "react";
import RootContext from "@/app/[locale]/_util/root-context";
import {NotesListProvider} from "@/app/[locale]/@notesList/notes-list";
import {Box} from "@mui/material";

export default function LocaleLayout(
    props: { header: React.ReactNode, selectedNote: React.ReactNode, notesList: React.ReactNode}
) {
    return (
        <RootContext>
            <NotesListProvider>
                <Box className="flex flex-col h-dvh">
                    {props.header}
                    <Box className="flex min-h-0">
                        {props.notesList}
                        {props.selectedNote}
                    </Box>
                </Box>
            </NotesListProvider>
        </RootContext>
    )
}
