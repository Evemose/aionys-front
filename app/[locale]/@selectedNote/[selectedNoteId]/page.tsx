"use client"

import Note from "@/app/_models/Note";
import React, {useContext, useEffect, useState} from "react";
import {IconButton, TextField, Tooltip, Typography} from "@mui/material";
import {useCurrentLocale, useScopedI18n} from "@/config/locales/client";
import {Box} from "@mui/system";
import {Check, Delete, Edit} from "@mui/icons-material";
import {notFound} from "next/navigation";
import {NotesListContext} from "@/app/[locale]/@notesList/notes-context";
import LoadingSelectedNote from "@/app/[locale]/@selectedNote/[selectedNoteId]/loading-client";
import {del, patch} from "@/app/[locale]/_util/fetching";
import {toMap} from "@/app/_models/Error";
import {ErrorFormHelper, Timestamp} from "@/app/[locale]/_util/components-client";
import {Container} from "@/app/[locale]/@selectedNote/[selectedNoteId]/container";
import Link from "next/link";

function EditOrSaveButton({isEditing, setEditing}: {
    isEditing: boolean,
    setEditing: (isEditing: boolean) => void
}) {
    const scopedT = useScopedI18n("commons");
    return !isEditing ?
        <Tooltip title={scopedT("edit")}>
            <IconButton className="self-start" onClick={(e) => {
                e.preventDefault();
                setEditing(true);
            }} id="edit-button">
                <Edit/>
            </IconButton>
        </Tooltip> :
        <Tooltip title={scopedT("save")}>
            <IconButton className="self-start" type="submit"
                        id="save-button">
                <Check/>
            </IconButton>
        </Tooltip>;
}


function NoteFormFields({note, FieldComponentType, fieldProps, errors}: {
    FieldComponentType: React.ComponentType<any>,
    fieldProps: Map<string, any>,
    note: Note,
    errors: Map<string, string[]>
}) {
    return <Box className="w-full flex flex-col gap-4">
        <ErrorFormHelper errors={errors} field="title"/>
        <FieldComponentType type="text" name="title" defaultValue={note.title} {...fieldProps.get("title")}
                            aria-label="title-helper">
            {note.title}
        </FieldComponentType>
        <ErrorFormHelper errors={errors} field="content"/>
        <FieldComponentType type="text" name="content" aria-label="content-helper"
                            defaultValue={note.content} {...fieldProps.get("content")}>
            {note.content}
        </FieldComponentType>
        <Timestamp createdAt={note.createdAt} lastModifiedAt={note.lastModifiedAt}
                   id={"selected-note"}/>
    </Box>;
}

function DeleteButton({setSuspended}: { setSuspended: (value: boolean) => void }) {
    const scopedT = useScopedI18n("commons");
    const noteId = useContext(SelectedNoteIdContext);
    const {notes, setNotes} = useContext(NotesListContext);
    const currentLocale = useCurrentLocale();

    return (
        <Tooltip title={scopedT("delete")}>
            <Link href={`/${currentLocale}`} className="self-start">
                <IconButton onClick={async () => {
                    const response = await del(`/notes/${noteId}`);

                    if (!response.ok) {
                        console.error(response);
                        return;
                    }
                    setNotes(notes!.filter(n => n.id !== noteId));
                    // to prevent 404 page flashing
                    setSuspended(true);
                }} id="delete-button">
                    <Delete/>
                </IconButton>
            </Link>
        </Tooltip>
    );
}

const nonEditableProps = new Map<string, any>([
    ["title", {
        variant: "h1"
    }],
    ["content", {
        variant: "body1"
    }]
]);

function SelectedNote() {
    const [isEditing, setEditing] = useState(false);
    const noteId = useContext(SelectedNoteIdContext);
    const {notes, setNotes} =
        useContext(NotesListContext) as { notes: Note[], setNotes: (notes: Note[]) => void };
    const note = notes?.find(n => n.id === noteId)!;
    const [loading, setLoading] = useState(true);
    // render is being suspended on deletion to prevent error flashing util next page is loaded
    const [suspended, setSuspended] = useState(false);
    const scopedT = useScopedI18n("noteFields");
    const [errors, setErrors] = useState(new Map<string, string[]>());

    const editableProps = new Map<string, any>([
        ["title", {
            variant: "outlined",
            label: scopedT("title"),
            name: "title"
        }],
        ["content", {
            variant: "outlined",
            label: scopedT("content"),
            name: "content"
        }]
    ]);

    useEffect(() => {
        if (notes) {
            if (!note && !suspended) {
                notFound();
            }
            setLoading(false);
        }
    }, [suspended, note, notes]);

    if (suspended) {
        return <Container />;
    }

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

                    if (!response.ok) {
                        setErrors(toMap(await response.json()));
                        return;
                    }

                    setErrors(new Map<string, string[]>());
                    const newNote = Note.fromResponseData(await response.json());
                    setNotes(notes.map(n => n.id === noteId ? newNote : n));
                    setEditing(false);
                }}>
                    <NoteFormFields note={note} FieldComponentType={isEditing ? TextField : Typography} fieldProps={
                        isEditing ? editableProps : nonEditableProps
                    } errors={errors}/>
                    <EditOrSaveButton isEditing={isEditing} setEditing={setEditing}/>
                    <DeleteButton setSuspended={setSuspended}/>
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

