"use client"

import {Stack, TextField} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Note, {useNotes} from "@/app/_models/Note";
import NoteCard from "@/app/[locale]/notes/note-card";
import React, {useContext, useState} from "react";

export default function NotesList() {
    const {notes} = useContext(NotesListContext) as { notes: Note[] };
    const [searchFilter, setSearchFilter]
        = useState((() => () => true) as () => (note: Note) => boolean);
    return (
        <Stack className="w-1/4 pr-4 pt-4 pl-4 h-full overflow-y-scroll overflow-x-clip" gap={1}>
            <NotesSearch notes={notes} setSearchFilter={setSearchFilter}/>
            {
                notes.filter(searchFilter).map(note => <NoteCard note={note} key={note.id}/>)
            }
        </Stack>
    )
}

export const NotesListContext = React.createContext(
    {
        notes: [],
        setNotes: () => {
            throw new Error("Notes context not initialized")
        }
    } as {
        notes: Note[],
        setNotes: (notes: Note[]) => void
    });

export function NotesListProvider({children}: { children: React.ReactNode }) {
    const [notes, setNotes] = React.useState(useNotes());
    return (
        <NotesListContext.Provider value={{notes, setNotes}}>
            {children}
        </NotesListContext.Provider>
    )
}

function NotesSearch({notes, setSearchFilter}: { notes: Note[],
    setSearchFilter: React.Dispatch<React.SetStateAction<(note: Note) => boolean>> }) {
    return <Autocomplete renderInput={(params) =>
        // @ts-ignore
        <TextField {...params} placeholder="Search notes" fullWidth={true} variant="outlined"/>
    } options={notes.map(note => note.title)} autoComplete freeSolo
    onInputChange={(ignored, value, reason) => {
        if (reason === "clear" || !value) {
            setSearchFilter(() => () => true);
        } else {
            setSearchFilter(() => (note: Note) => note.title.toLowerCase().includes(value.toLowerCase()));
        }
    }}/>
}