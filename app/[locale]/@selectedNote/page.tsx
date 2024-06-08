"use client"

import {useScopedI18n} from "@/config/locales/client";
import React, {useContext, useRef} from "react";
import Note from "@/app/_models/Note";
import {NotesListContext} from "@/app/[locale]/@notesList/notes-list";
import {Box} from "@mui/system";
import {Button, TextField, Tooltip} from "@mui/material";
import {Container} from "@/app/[locale]/@selectedNote/[selectedNoteId]/page";

export default function AddNote() {
    const scopedTMaximized = useScopedI18n("maximizedCard");
    const scopedTCommons = useScopedI18n("commons");
    const newNoteRef = useRef(new Note(-1, "", "", new Date(), new Date()));
    const {notes, setNotes} = useContext(NotesListContext);
    return (
        <Container>
            <Box className="flex flex-col gap-2 h-full overflow-y-auto pt-1.5" component="form" onSubmit={(e) => {
                e.preventDefault()
                console.log(newNoteRef.current);
                setNotes([...notes, newNoteRef.current]);
            }}>
                <TextField label={scopedTMaximized("title")} variant="outlined"
                           onChange={(e) => {
                               newNoteRef.current.title = e.target.value ?? "";
                           }}/>
                <TextField label={scopedTMaximized("content")} variant="outlined" multiline
                           sx={{display: 'flex', flexGrow: 1}}
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
                <Tooltip title={scopedTCommons("save")}>
                    <Button type="submit" color="primary" variant="contained" className="w-1/6 self-center">
                        {scopedTCommons("save")}
                    </Button>
                </Tooltip>
            </Box>
        </Container>
    );
}