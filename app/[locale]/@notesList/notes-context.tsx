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
    const {pushAll, clear} = useNotesList(state => {
        return {
            clear: state.clear,
            pushAll: state.pushAll
        }
    });

    useEffect(() => {
        if (notes) {
            pushAll(notes);
        } else {
            // only happens when page is refreshed
            clear();
        }
    }, [clear, notes, pushAll]);

    return <>{children}</>
}