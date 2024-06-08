"use client"

import Note from "@/app/_models/Note";
import React, {useContext, useRef} from "react";
import {IconButton, Paper, Tooltip, Typography} from "@mui/material";
import {Timestamp} from "@/app/[locale]/_util/components";
import {useCurrentLocale, useScopedI18n} from "@/config/locales/client";
import {Box} from "@mui/system";
import {Check, Delete, Edit} from "@mui/icons-material";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {getPathSegments} from "@/app/[locale]/_util/misc";
import {NotesListContext} from "@/app/[locale]/@notesList/notes-context";

function EditOrSaveButton({isEditing, setEditing}: { isEditing: boolean, setEditing: (isEditing: boolean) => void }) {
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

function EditableTypography(props: {
    typographyProps?: any,
    field: "title" | "content",
    tempNote: React.MutableRefObject<Note>
}) {
    return <Typography
        {...props.typographyProps}
        suppressContentEditableWarning={true}
        onInput={(e: React.ChangeEvent) => {
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

function DeleteButton() {
    const scopedT = useScopedI18n("commons");
    const noteId = parseInt(useSearchParams().get("selectedNoteId")!);
    const {notes, setNotes} = useContext(NotesListContext);
    const router = useRouter();
    const currentLocale = useCurrentLocale();
    return (
        <Tooltip title={scopedT("delete")}>
            <IconButton onClick={() => {
                setNotes(notes.filter(n => n.id !== noteId));
                router.push(`/${currentLocale}`)
            }} className="self-start">
                <Delete/>
            </IconButton>
        </Tooltip>
    );
}

function SelectedNote() {
    const [isEditing, setIsEditing] = React.useState(false);
    const pathSegments = getPathSegments(usePathname());
    const noteId = parseInt(pathSegments[pathSegments.length - 1]);
    const {notes, setNotes} =
        useContext(NotesListContext) as { notes: Note[], setNotes: (notes: Note[]) => void };
    // use ref to store the note so that it does not re-render on every input
    const tempNote = useRef(notes.find(n => n.id === noteId)!);

    return (
        <Container>
            <Box component="form" className="flex" onSubmit={(e) => {
                e.preventDefault();
                setNotes(notes.map(n => n.id === noteId ? tempNote.current : n));
            }}>
                <NoteForm contentEditable={isEditing} noteRef={tempNote}/>
                <EditOrSaveButton isEditing={isEditing} setEditing={setIsEditing}/>
                <DeleteButton/>
            </Box>
        </Container>
    );
}

// there is no realistic case when this would overflow because script runs on client
let keyCounter = Number.MIN_VALUE;

export default function NoteMaximized() {
    return <SelectedNote key={keyCounter++}/>
}

export function Container({children, styles}: { children: React.ReactNode, styles?: string }) {
    return (
        <Paper className={styles + " w-3/4 p-4 m-10"} elevation={3}>
            {children}
        </Paper>
    )
}