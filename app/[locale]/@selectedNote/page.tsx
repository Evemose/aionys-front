"use client"

import {useScopedI18n} from "@/config/locales/client";
import React, {useContext, useRef, useState} from "react";
import Note from "@/app/_models/Note";
import {Box} from "@mui/system";
import {Button, TextField, Tooltip} from "@mui/material";
import {Container} from "@/app/[locale]/@selectedNote/[selectedNoteId]/page";
import {NotesListContext} from "@/app/[locale]/@notesList/notes-context";
import {post} from "@/app/[locale]/_util/fetching";
import ErrorResponse, {toMap} from "@/app/_models/Error";
import {ErrorFormHelper} from "@/app/[locale]/_util/components";

async function handlePostError(
    response: Response,
    setErrors: (value: (((prevState: Map<string, string[]>) => Map<string, string[]>) | Map<string, string[]>)) => void
) {
    if (response.status === 400) {
        const errors = await response.json() as ErrorResponse[];
        const newMap = toMap(errors)
        console.log(newMap)
        setErrors(toMap(errors));
    } else if (response.status === 401) {
        throw new Error("Your log in expired. Please log in again.");
    } else {
        throw new Error("Unexpected error occurred");
    }
}

export default function AddNote() {
    const scopedTMaximized = useScopedI18n("maximizedCard");
    const scopedTCommons = useScopedI18n("commons");
    const newNoteRef = useRef(new Note(-1, "", "", new Date(), new Date()));
    const {notes, setNotes} = useContext(NotesListContext);
    const [errors, setErrors] = useState<Map<string, string[]>>(new Map());
    return (
        <Container>
            <Box className="flex flex-col gap-2 h-full overflow-y-auto pt-1.5" component="form"
                 onSubmit={async (e) => {
                     e.preventDefault()
                     const response = await post("/notes", newNoteRef.current);
                     if (response.status !== 201) {
                         await handlePostError(response, setErrors);
                         return;
                     }
                     setNotes([...notes, Note.fromResponseData(await response.json())]);
                 }}>
                <TextField label={scopedTMaximized("title")} variant="outlined"
                           onChange={(e) => {
                               newNoteRef.current.title = e.target.value ?? "";
                           }}
                           aria-label={"title-helper"}
                />
                <ErrorFormHelper errors={errors} field={"title"}/>
                <TextField label={scopedTMaximized("content")} variant="outlined" multiline
                           sx={{display: 'flex', flexGrow: 1}}
                           aria-label={"content-helper"}
                           InputProps={{
                               style: {
                                   height: "100%",
                                   display: "flex",
                                   alignItems: "flex-start"
                               }
                           }}
                           onChange={(e) => {
                               newNoteRef.current.content = e.target.value ?? "";
                           }}
                />
                <ErrorFormHelper errors={errors} field={"content"}/>
                <Tooltip title={scopedTCommons("save")}>
                    <Button type="submit" color="primary" variant="contained" className="w-1/6 self-center">
                        {scopedTCommons("save")}
                    </Button>
                </Tooltip>
            </Box>
        </Container>
    );
}