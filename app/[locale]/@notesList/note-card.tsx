"use client"

import Note from "@/app/_models/Note";
import {Paper, Tooltip, Typography} from "@mui/material";
import {Button} from "@mui/base";
import {Timestamp} from "@/app/[locale]/_util/components-client";
import React from "react";
import {Add} from "@mui/icons-material";
import {useScopedI18n} from "@/config/locales/client";
import {useRouter} from "next/navigation";


export default function NoteCard(props: { note: Note }) {
    const note = props.note; // cant destructure props in component params due to wierd warning
    // "Props must be serializable for components in the "use client" entry file, "note" is invalid."
    const router = useRouter();
    return (
        <Button className="text-start" onClick={(e) => {
            e.preventDefault();
            router.push(`/${note.id}`);
        }}>
            <Container>
                <Typography variant="h6">{note.title}</Typography>
                <Typography>
                    {
                        note.content.length > 30 ? note.content.substring(0, 30) + "..." : note.content
                    }
                </Typography>
                <Timestamp createdAt={note.createdAt} lastModifiedAt={note.lastModifiedAt}/>
            </Container>
        </Button>
    )
}

export function AddNoteCard() {
    const scopedT = useScopedI18n("notesList");
    const router = useRouter();
    return (
        <Tooltip title={scopedT("addNote")}>
            <Button className="text-start" onClick={(e) => {
                e.preventDefault();
                router.push("/");
            }}>
                <Container containerClasses="flex justify-center items-center">
                    <Add/>
                </Container>
            </Button>
        </Tooltip>
    )
}

function Container(props: { children: React.ReactNode, containerClasses?: string }) {
    return (
        <Paper className={props.containerClasses + " rounded-3xl hover:scale-105 pl-4 py-2"} elevation={3}>
            {props.children}
        </Paper>
    )
}