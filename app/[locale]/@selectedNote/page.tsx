"use client"

import {useScopedI18n} from "@/config/locales/client";
import React, {useState} from "react";
import Note from "@/app/_models/Note";
import {Box} from "@mui/system";
import {Button, TextField, Tooltip} from "@mui/material";
import {useNotesList} from "@/app/[locale]/@notesList/notes-context";
import {post} from "@/app/[locale]/_util/fetching";
import ErrorResponse, {toMap} from "@/app/_models/Error";

import {ErrorFormHelper} from "@/app/[locale]/_util/components-client";
import {Container} from "@/app/[locale]/@selectedNote/[selectedNoteId]/container";

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
    const scopedTCommons = useScopedI18n("commons");
    const scopedTNotes = useScopedI18n("noteFields");
    const addNote = useNotesList(state => state.push);
    const [errors, setErrors] = useState<Map<string, string[]>>(new Map());
    return (
        <Container>
            <Box className="flex flex-col gap-2 h-full overflow-y-auto pt-1.5" component="form"
                 onSubmit={async (e) => {
                     e.preventDefault();
                     const currentTarget = e.currentTarget;
                     const formData = new FormData(currentTarget);
                     const response = await post("/notes", {
                         title: formData.get("title") as string,
                         content: formData.get("content") as string,
                     });
                     if (!response.ok) {
                         await handlePostError(response, setErrors);
                         return;
                     }
                     addNote(Note.fromResponseData(await response.json()));
                     currentTarget.reset();
                 }}>
                <TextField label={scopedTNotes("title")} variant="outlined"
                           aria-label={"title-helper"}
                           name="title"
                />
                <ErrorFormHelper errors={errors} field={"title"} fieldNameSource={scopedTNotes as (field: string) => string}/>
                <TextField label={scopedTNotes("content")} variant="outlined" multiline
                           sx={{display: 'flex', flexGrow: 1}}
                           aria-label={"content-helper"}
                           InputProps={{
                               style: {
                                   height: "100%",
                                   display: "flex",
                                   alignItems: "flex-start"
                               }
                           }}
                           name="content"
                />
                <ErrorFormHelper errors={errors} field={"content"} fieldNameSource={scopedTNotes as (field: string) => string}/>
                <Tooltip title={scopedTCommons("save")}>
                    <Button type="submit" color="primary" variant="contained" className="w-1/6 self-center">
                        {scopedTCommons("save")}
                    </Button>
                </Tooltip>
            </Box>
        </Container>
    );
}