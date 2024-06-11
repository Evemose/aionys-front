"use client"

import React, {useEffect, useState} from "react";
import Note from "@/app/_models/Note";

import {useGet} from "@/app/[locale]/_util/fetching-client";

export const NotesListContext = React.createContext(
    {
        notes: [],
        setNotes: () => {
            throw new Error("Notes context not initialized")
        }
    } as {
        notes: Note[] | null,
        setNotes: (notes: Note[]) => void
    });


export default function NotesListProvider({children}: { children: React.ReactNode }) {
    const {data: notes} = useGet("/notes");
    return (
        <NotesListInner notes={notes}>
            {children}
        </NotesListInner>
    )
}

function NotesListInner({children, notes}: { children: React.ReactNode, notes?: Note[] }) {
    const [stateNotes, setNotes] = useState(notes as Note[] | null);

    useEffect(() => {
        if (notes) {
            setNotes((stateNotes) => {
                return (stateNotes ?? []).concat(
                    notes.map(note => Note.fromResponseData(note))
                        .filter((note) => !stateNotes?.some((n) => n.id === note.id))
                );
            });
        } else {
            setNotes(null); // reset notes
        }
    }, [notes]);

    return (
        <NotesListContext.Provider value={{notes: stateNotes ?? null, setNotes}}>
            {children}
        </NotesListContext.Provider>
    )
}