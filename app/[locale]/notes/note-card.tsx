"use client"

import Note from "@/app/_models/Note";
import {Paper, Typography} from "@mui/material";
import {Button} from "@mui/base";
import {Timestamp} from "@/app/[locale]/_util/components";
import {SelectedNoteContext} from "@/app/[locale]/notes/note-maximized";
import {useContext} from "react";


export default function NoteCard(props: { note: Note }) {
    const note = props.note; // cant destructure props in component params due to wierd warning
    // "Props must be serializable for components in the "use client" entry file, "note" is invalid."
    const {setNoteId: setSelectedNote} = useContext(SelectedNoteContext);
    return (
        <Button className="text-start" onClick={(e) => {
            e.preventDefault();
            setSelectedNote(note.id);
        }}>
            <Paper className="rounded-3xl hover:scale-105 pl-4 py-2" elevation={3}>
                <Typography variant="h6">{note.title}</Typography>
                <Typography>
                    {
                        note.content.length > 30 ? note.content.substring(0, 30) + "..." : note.content
                    }
                </Typography>
                <Timestamp createdAt={note.createdAt} lastModifiedAt={note.lastModifiedAt}/>
            </Paper>
        </Button>
    )
}