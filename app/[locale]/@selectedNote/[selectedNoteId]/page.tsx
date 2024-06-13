"use client"

import Note from "@/app/_models/Note";
import React, {useEffect, useState} from "react";
import {IconButton, TextField, Tooltip, Typography} from "@mui/material";
import {useCurrentLocale, useScopedI18n} from "@/config/locales/client";
import {Box} from "@mui/system";
import {Check, Delete, Edit} from "@mui/icons-material";
import {notFound} from "next/navigation";
import {useNotesList} from "@/app/[locale]/@notesList/notes-context";
import LoadingSelectedNote from "@/app/[locale]/@selectedNote/[selectedNoteId]/loading-client";
import {del, patch} from "@/app/[locale]/_util/fetching";
import {toMap} from "@/app/_models/Error";
import {ErrorFormHelper, Timestamp} from "@/app/[locale]/_util/components-client";
import {Container} from "@/app/[locale]/@selectedNote/[selectedNoteId]/container";
import Link from "next/link";
import {create} from "zustand";

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
    const scopedT = useScopedI18n("noteFields");
    return <Box className="w-full flex flex-col gap-4">
        <ErrorFormHelper errors={errors} field="title" fieldNameSource={scopedT as (field: string) => string}/>
        <FieldComponentType type="text" name="title" defaultValue={note.title} {...fieldProps.get("title")}
                            aria-label="title-helper">
            {note.title}
        </FieldComponentType>
        <ErrorFormHelper errors={errors} field="content" fieldNameSource={scopedT as (field: string) => string}/>
        <FieldComponentType type="text" name="content" aria-label="content-helper"
                            defaultValue={note.content} {...fieldProps.get("content")}>
            {note.content}
        </FieldComponentType>
        <Timestamp createdAt={note.createdAt} lastModifiedAt={note.lastModifiedAt}
                   id={"selected-note"}/>
    </Box>;
}

function DeleteButton() {
    const scopedT = useScopedI18n("commons");
    const {noteId, resetSelectedNoteId} = useSelectedNoteId(state => {
        return {
            noteId: state.selectedNoteId!,
            resetSelectedNoteId: state.clearSelectedNoteId
        }
    });
    const removeNote = useNotesList(state => state.removeById);
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

                    resetSelectedNoteId();
                    removeNote(noteId);
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
    const {noteId, resetCalled} = useSelectedNoteId(state => {
        return {
            noteId: state.selectedNoteId,
            resetCalled: state.resetCalled
        }
    });
    const {notes, update} = useNotesList(state => {
        return {
            notes: state.notes,
            update: state.update
        }
    });

    const note = notes?.find(n => n.id === noteId)!;
    const [loading, setLoading] = useState(true);
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
            if (!note && !resetCalled) {
                notFound();
            }
            setLoading(false);
        }
    }, [resetCalled, note, notes]);

    // avoid unnecessary rendering and errors while awaiting redirect
    if (resetCalled) {
        return <Container />;
    }

    return (
        <Container>
            {
                // very rarely note is already deleted, but guard clause is not triggered,
                // so better to check note existence here also
                !loading && note ? <Box component="form" className="flex" onSubmit={async (e) => {
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
                    update(Note.fromResponseData(await response.json()));
                    setEditing(false);
                }}>
                    <NoteFormFields note={note} FieldComponentType={isEditing ? TextField : Typography} fieldProps={
                        isEditing ? editableProps : nonEditableProps
                    } errors={errors}/>
                    <EditOrSaveButton isEditing={isEditing} setEditing={setEditing}/>
                    <DeleteButton />
                </Box> : <LoadingSelectedNote box/>
            }
        </Container>
    );
}

// for some reason type isn`t inferred automatically
const useSelectedNoteId = create<{
    selectedNoteId: number | null,
    resetCalled: boolean,
    clearSelectedNoteId: () => void,
    setSelectedNoteId: (selectedNoteId: number) => void
}>((set) =>({
    selectedNoteId: null,
    resetCalled: false,
    clearSelectedNoteId: () => set({selectedNoteId: null, resetCalled: true}),
    setSelectedNoteId: (selectedNoteId: number) => set({selectedNoteId, resetCalled: false})
}));

export default function NoteMaximized({params}: { params: { selectedNoteId: string } }) {
    const setSelectedNoteId = useSelectedNoteId(state => state.setSelectedNoteId);
    setSelectedNoteId(Number(params.selectedNoteId));
    return <SelectedNote />
}

