"use client"

import React, {useEffect} from "react";
import Note from "@/app/_models/Note";
import {useGet} from "@/app/[locale]/_util/fetching-client";
import {create} from "zustand";

type NotesState = {
    notes: Note[] | null,
    removeById: (noteId: number) => void,
    update: (note: Note) => void,
    push: (note: Note) => void,
    pushAll: (notes: Note[]) => void,
    clear: () => void
};

export const useNotesList = create<NotesState>((set) => ({
    notes: null,
    removeById: (noteId: number) => set((state) => {
        if (state.notes) {
            return {notes: state.notes.filter((n) => n.id !== noteId)};
        }
        return state;
    }),
    update: (note: Note) => set((state) => {
        if (state.notes) {
            return {notes: state.notes.map((n) => n.id === note.id ? note : n)};
        }
        return state;
    }),
    push: (note: Note) => set((state) => {
        if (!state.notes) {
            state.notes = [];
        }
        return {notes: [...state.notes, note]};
    }),
    pushAll: (notes: Note[]) => set((state) => {
        if (!state.notes) {
            state.notes = [];
        }
        return {notes: [...state.notes, ...notes]};
    }),
    clear: () => set({notes: null})
}));


export default function NotesListProvider({children}: { children: React.ReactNode }) {
    const {data: notes} = useGet("/notes");
    return <NotesListProviderInner notes={notes} children={children}/>
}

// use inner to not perform fetch on every state change
function NotesListProviderInner({children, notes}: { children: React.ReactNode, notes: Note[] }) {
    const {stateNotes, pushAll, clear} = useNotesList(state => {
        return {
            stateNotes: state.notes,
            clear: state.clear,
            pushAll: state.pushAll
        }
    });

    useEffect(() => {
        console.log("notes", notes);
        if (notes) {
            pushAll(notes
                .map(Note.fromResponseData)
                // remove duplicates
                .filter((note: Note) => !stateNotes || !stateNotes.some((n) => n.id === note.id)));
        } else {
            // only happens when page is refreshed
            clear();
        }
    }, [clear, notes, pushAll]);

    return <>{children}</>
}