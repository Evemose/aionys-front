"use client"

import React, {useEffect} from "react";
import Note from "@/app/_models/Note";
import {useGet} from "@/app/[locale]/_util/fetching-client";
import {create} from "zustand";

type NotesState = {
    notes: Note[] | null,
    readonly removeById: (noteId: number) => void,
    readonly update: (note: Note) => void,
    readonly push: (note: Note) => void,
    readonly pushAllIgnoreDuplicates: (notes: Note[]) => void,
    readonly clear: () => void
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
    pushAllIgnoreDuplicates: (notes: Note[]) => set((state) => {
        if (!state.notes) {
            state.notes = [];
        }
        return {
            notes: [...state.notes,
                ...notes
                    .filter((note) => {
                        return !state.notes?.some((n) => n.id === note.id)
                    })]
        };
    }),
    clear: () => set({notes: null})
}));


export default function NotesListProvider({children}: { children: React.ReactNode }) {
    const {data: notes} = useGet("/notes");
    return (
        <NotesListProviderInner notes={notes}>
            {children}
        </NotesListProviderInner>
    );
}

// use inner to not perform fetch on every state change
function NotesListProviderInner({children, notes}: { children: React.ReactNode, notes: Note[] }) {
    const {pushAllIgnoreDuplicates, clear} = useNotesList(state => {
        return {
            stateNotes: state.notes,
            clear: state.clear,
            pushAllIgnoreDuplicates: state.pushAllIgnoreDuplicates
        }
    });

    useEffect(() => {
        console.log("notes", notes);
        if (notes) {
            pushAllIgnoreDuplicates(notes.map(Note.fromResponseData));
        } else {
            // only happens when page is refreshed
            clear();
        }
    }, [notes]);

    return <>{children}</>
}