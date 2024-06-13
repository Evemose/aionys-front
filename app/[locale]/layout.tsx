import "@/static/styles.css";
import React from "react";
import RootContext from "@/app/[locale]/_util/root-context";
import {Box} from "@mui/material";
import NotesListProvider from "@/app/[locale]/@notesList/notes-context";
import Note from "@/app/_models/Note";
import {LoggedInOnlyContainer} from "@/app/[locale]/_util/components-client";
import {cookies} from "next/headers";

export default function LocaleLayout(
    props: { header: React.ReactNode, selectedNote: React.ReactNode, notesList: React.ReactNode, notes: Note[] }
) {
    return (
        <RootContext>
            {/* Without key, for some reason, this component does not re-fetch data on the first render after login
              * (any subsequent render works fine)
             */}
            <Box className="flex flex-col h-dvh">
                {props.header}
                <LoggedInOnlyContainer>
                    <NotesListProvider key={cookies().get("BearerTail")?.value.toString() ?? ""}>
                        <Box className="flex h-[90dvh]">
                            {props.notesList}
                            {props.selectedNote}
                        </Box>
                    </NotesListProvider>
                </LoggedInOnlyContainer>
            </Box>
        </RootContext>
    )
}
