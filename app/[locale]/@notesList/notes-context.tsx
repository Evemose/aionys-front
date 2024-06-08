"use client"

import React from "react";
import Note, {useNotes} from "@/app/_models/Note";

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