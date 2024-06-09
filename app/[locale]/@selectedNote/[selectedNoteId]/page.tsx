"use client"

import Note from "@/app/_models/Note";
import React, {useContext, useEffect, useRef, useState} from "react";
import {IconButton, Paper, TextField, Tooltip, Typography} from "@mui/material";
import {Timestamp} from "@/app/[locale]/_util/components-client";
import {useCurrentLocale, useScopedI18n} from "@/config/locales/client";
import {Box} from "@mui/system";
import {Check, Delete, Edit} from "@mui/icons-material";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {getPathSegments} from "@/app/[locale]/_util/misc";
import {NotesListContext} from "@/app/[locale]/@notesList/notes-context";
import LoadingSelectedNote from "@/app/[locale]/@selectedNote/[selectedNoteId]/loading-client";
import {del, patch} from "@/app/[locale]/_util/fetching";

export function EditOrSaveButton({isEditing, setEditing}: {
    isEditing: boolean,
    setEditing: (isEditing: boolean) => void
}) {
    const scopedT = useScopedI18n("commons");
    return !isEditing ?
        <Tooltip title={scopedT("edit")}>
            <IconButton className="self-start" onClick={() => setEditing(true)}>
                <Edit/>
            </IconButton>
        </Tooltip> :
        <Tooltip title={scopedT("save")}>
            <IconButton className="self-start" type="submit" onClick={(e) => {
                setEditing(false);
                e.currentTarget.form!.requestSubmit();
            }}>
                <Check/>
            </IconButton>
        </Tooltip>;
}


function NoteFormFields({note, FieldComponentType, fieldProps}: {
    FieldComponentType: React.ComponentType<any>,
    fieldProps: Map<string, any>,
    note: Note,
}) {
    return <Box className="w-full flex flex-col gap-4">
        <FieldComponentType type="text" name="title" defaultValue={note.title} {...fieldProps.get("title")}>
            {note.title}
        </FieldComponentType>
        <FieldComponentType type="text" name="content" defaultValue={note.content} {...fieldProps.get("content")}>
            {note.content}
        </FieldComponentType>
        <Timestamp createdAt={note.createdAt} lastModifiedAt={note.lastModifiedAt}/>
    </Box>;
}

export function DeleteButton() {
    const scopedT = useScopedI18n("commons");
    const noteId = useContext(SelectedNoteIdContext);
    const {notes, setNotes} = useContext(NotesListContext);
    const router = useRouter();
    const currentLocale = useCurrentLocale();
    return (
        <Tooltip title={scopedT("delete")}>
            <IconButton onClick={async () => {
                const response = await del(`/notes/${noteId}`);
                if (!response.ok) {
                    console.error(response);
                    return;
                }
                setNotes(notes.filter(n => n.id !== noteId));
                router.push(`/${currentLocale}`)
            }} className="self-start">
                <Delete/>
            </IconButton>
        </Tooltip>
    );
}

const editableProps = new Map<string, any>([
    ["title", {
        variant: "outlined",
        label: "Title",
        name: "title"
    }],
    ["content", {
        variant: "outlined",
        label: "Content",
        name: "content"
    }]
]);

const nonEditableProps = new Map<string, any>([
    ["title", {
        variant: "h1"
    }],
    ["content", {
        variant: "body1"
    }]
]);

function SelectedNote() {
    const [isEditing, setIsEditing] = useState(false);
    const noteId = useContext(SelectedNoteIdContext);
    const [loading, setLoading] = useState(true);
    const {notes, setNotes} =
        useContext(NotesListContext) as { notes: Note[], setNotes: (notes: Note[]) => void };
    const note = notes?.find(n => n.id === noteId)!;

    useEffect(() => {
        if (notes) {
            setLoading(false);
        }
    }, [noteId, notes]);

    return (
        <Container>
            {
                !loading ? <Box component="form" className="flex" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const response = await patch(`/notes/${noteId}`, {
                        title: formData.get("title") as string,
                        content: formData.get("content") as string
                    });
                    if (response.status !== 200) {
                        console.error(await response.json());
                        return;
                    }
                    const newNote = Note.fromResponseData(await response.json());
                    setNotes(notes.map(n => n.id === noteId ? newNote : n));
                }}>
                    <NoteFormFields note={note} FieldComponentType={isEditing ? TextField : Typography} fieldProps={
                        isEditing ? editableProps : nonEditableProps
                    }/>
                    <EditOrSaveButton isEditing={isEditing} setEditing={setIsEditing}/>
                    <DeleteButton/>
                </Box> : <LoadingSelectedNote box/>
            }
        </Container>
    );
}

// there is no realistic case when this would overflow because script runs on client
let keyCounter = Number.MIN_VALUE;

const SelectedNoteIdContext = React.createContext(0);

export default function NoteMaximized({params}: { params: { selectedNoteId: string } }) {
    return (
        <SelectedNoteIdContext.Provider value={parseInt(params.selectedNoteId)}>
            <SelectedNote key={keyCounter++}/>
        </SelectedNoteIdContext.Provider>
    )
}

export function Container({children, styles}: { children: React.ReactNode, styles?: string }) {
    return (
        <Paper className={styles + " w-3/4 p-4 m-10"} elevation={3}>
            {children}
        </Paper>
    )
}