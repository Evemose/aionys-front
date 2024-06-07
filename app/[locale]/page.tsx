import {Box} from "@mui/system";
import NotesList, {NotesListProvider} from "@/app/[locale]/notes/notes-list";
import React from "react";
import NoteMaximized, {SelectedNoteProvider} from "@/app/[locale]/notes/note-maximized";

export default async function Page() {
    return (
        <Box className="h-[89%] flex">
            <SelectedNoteProvider>
                <NotesListProvider>
                    <NotesList/>
                    <NoteMaximized/>
                </NotesListProvider>
            </SelectedNoteProvider>
        </Box>
    )
}