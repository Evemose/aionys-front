import "@/static/styles.css";
import React from "react";
import RootContext from "@/app/[locale]/_util/root-context";
import {Box} from "@mui/material";
import {LoggedInOnlyContainer} from "@/app/[locale]/_util/components";
import NotesListProvider from "@/app/[locale]/@notesList/notes-context";
import Note from "@/app/_models/Note";

export default function LocaleLayout(
    props: { header: React.ReactNode, selectedNote: React.ReactNode, notesList: React.ReactNode, notes: Note[]}
) {
    return (
        <RootContext>
            <NotesListProvider>
                <Box className="flex flex-col h-dvh">
                    {props.header}
                    <LoggedInOnlyContainer>
                        <Box className="flex min-h-[89%]">
                            {props.notesList}
                            {props.selectedNote}
                        </Box>
                    </LoggedInOnlyContainer>
                </Box>
            </NotesListProvider>
        </RootContext>
    )
}
