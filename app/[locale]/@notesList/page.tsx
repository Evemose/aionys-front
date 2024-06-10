"use client"

import {Skeleton, Stack, TextField} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Note from "@/app/_models/Note";
import NoteCard, {AddNoteCard} from "@/app/[locale]/@notesList/note-card";
import React, {useContext, useEffect, useState} from "react";
import {useScopedI18n} from "@/config/locales/client";
import {NotesListContext} from "@/app/[locale]/@notesList/notes-context";

// eslint-disable-next-line @next/next/no-async-client-component
export default function NotesList() {
    const notes = useContext(NotesListContext).notes;
    const [searchFilter, setSearchFilter]
        = useState((() => () => true) as () => (note: Note) => boolean);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (notes) {
            setLoading(false);
        }
    }, [notes]);

    return (
        <Container>
            <NotesSearch notes={notes ?? []} setSearchFilter={setSearchFilter}/>
            <AddNoteCard/>
            {
                !loading ? notes.filter(searchFilter).map(note => <NoteCard note={note} key={note.id}/>) :
                    Array.from({length: 5}, (_, i) =>
                        <Skeleton key={i} variant="rectangular" height={100} width="100%" className="rounded-3xl"/>
                    )
            }
        </Container>
    )
}

export function Container({children}: { children: React.ReactNode }) {
    return (
        <Stack className="w-1/4 pr-4 pt-4 pl-4 h-full overflow-y-auto overflow-x-clip" gap={1}>
            {children}
        </Stack>
    )
}

export function NotesSearch({notes, setSearchFilter}: {
    notes: Note[],
    setSearchFilter: React.Dispatch<React.SetStateAction<(note: Note) => boolean>>
}) {
    const scopedT = useScopedI18n("notesList");
    return <Autocomplete renderInput={(params) =>
        // @ts-ignore
        <TextField {...params} placeholder={scopedT("search")} fullWidth={true} variant="outlined"/>
    } options={notes.map(note => note.title)} autoComplete freeSolo
                         onInputChange={(ignored, value, reason) => {
                             if (reason === "clear" || !value) {
                                 setSearchFilter(() => () => true);
                             } else {
                                 setSearchFilter(() => (note: Note) => note.title.toLowerCase().includes(value.toLowerCase()));
                             }
                         }}/>
}