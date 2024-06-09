"use client"

import React, {useEffect, useState} from "react";
import Note, {getNotes, useNotes} from "@/app/_models/Note";
import useSWR from "swr";

import {useGet} from "@/app/[locale]/_util/fetching-client";

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


export default function NotesListProvider({children}: { children: React.ReactNode }) {
    const {data: notes} = useGet("/notes");
    const [stateNotes, setNotes] = useState(notes);
    useEffect(() => {
        setNotes(notes?.map((note: any) => Note.fromResponseData(note)) ?? null)
    }, [notes]);
    return (
        <NotesListContext.Provider value={{notes: stateNotes, setNotes}}>
            {children}
        </NotesListContext.Provider>
    )
}