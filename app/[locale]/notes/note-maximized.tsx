"use client"

import Note from "@/app/_models/Note";
import React, {useContext, useRef} from "react";
import {IconButton, Paper, Typography} from "@mui/material";
import {Timestamp} from "@/app/[locale]/_util/components";
import {useScopedI18n} from "@/config/locales/client";
import {Box} from "@mui/system";
import {Check, Edit} from "@mui/icons-material";
import {NotesListContext} from "@/app/[locale]/notes/notes-list";

export const SelectedNoteContext = React.createContext(
    {
        noteId: null,
        setNoteId: () => {
            throw new Error("Note context not initialized")
        }
    } as {
        noteId: number | null,
        setNoteId: (noteId: number | null) => void
    });

export function SelectedNoteProvider({children}: { children: React.ReactNode }) {
    const [selectedNoteId, setSelectedNoteId] =
        React.useState<number | null>(null);
    return (
        <SelectedNoteContext.Provider value={{noteId: selectedNoteId, setNoteId: setSelectedNoteId}}>
            {children}
        </SelectedNoteContext.Provider>
    )
}

function NoSelectedNote() {
    const scopedT = useScopedI18n("maximizedCard")
    return (
        <Container styles="flex flex-col justify-center items-center">
            <Typography variant="h1" color="gray">{scopedT("noNoteSelected")}</Typography>
        </Container>
    );
}

function EditOrSaveButton({isEditing, setEditing}: { isEditing: boolean, setEditing: (isEditing: boolean) => void }) {
    return <>
        {!isEditing &&
            <IconButton className="self-start" onClick={() => setEditing(true)}>
                <Edit/>
            </IconButton>
        }
        {
            isEditing &&
            <IconButton className="self-start" type="submit">
                <Check/>
            </IconButton>
        }
    </>;
}

function EditableTypography(props: {
    typographyProps?: any,
    field: "title" | "content",
    tempNote: React.MutableRefObject<Note> }) {
    return <Typography
        {...props.typographyProps}
        suppressContentEditableWarning={true}
        onInput={(e) => {
            props.tempNote.current[props.field] = e.currentTarget.textContent!;
        }}>{props.tempNote.current[props.field]}</Typography>;
}

function NoteForm(props: {
    contentEditable: boolean,
    noteRef: React.MutableRefObject<Note>,
}) {
    return <Box className="w-full flex flex-col">
        <EditableTypography tempNote={props.noteRef} field={"title"} typographyProps={{
            variant: "h1",
            contentEditable: props.contentEditable,
        }}/>
        <EditableTypography tempNote={props.noteRef} field={"content"} typographyProps={{
            variant: "body1",
            contentEditable: props.contentEditable,
        }}/>
        <Timestamp createdAt={props.noteRef.current.createdAt} lastModifiedAt={props.noteRef.current.lastModifiedAt}/>
    </Box>;
}

function SelectedNote() {
    const [isEditing, setIsEditing] = React.useState(false);
    const {noteId} = useContext(SelectedNoteContext) as { noteId: number };
    const {notes, setNotes} =
        useContext(NotesListContext) as { notes: Note[], setNotes: (notes: Note[]) => void };
    // use ref to store the note so that it does not re-render on every input
    const tempNote = useRef(notes.find(n => n.id === noteId)!);

    return (
        <Container>
            <Box component="form" className="flex" onSubmit={(e) => {
                e.preventDefault();
                // optimize if note is not changed
                if (tempNote.current !== notes.find(n => n.id === noteId)) {
                    setNotes(notes.map(n => n.id === noteId ? tempNote.current : n));
                }
            }}>
                <NoteForm contentEditable={isEditing} noteRef={tempNote} />
                <EditOrSaveButton isEditing={isEditing} setEditing={setIsEditing}/>
            </Box>
        </Container>
    );
}

// there is no realistic case when this would overflow because script runs on client
let keyCounter = Number.MIN_VALUE;

export default function NoteMaximized() {
    const {noteId} = useContext(SelectedNoteContext) as { noteId: number | null };
    return noteId ? <SelectedNote key={keyCounter++} /> : <NoSelectedNote/>
}

function Container({children, styles}: { children: React.ReactNode, styles?: string }) {
    return (
        <Paper className={styles + " w-3/4 p-4 m-10"} elevation={3}>
            {children}
        </Paper>
    )
}