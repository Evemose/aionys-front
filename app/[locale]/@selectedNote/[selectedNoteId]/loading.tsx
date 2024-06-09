import {IconButton, Skeleton, Typography} from "@mui/material";
import {Box} from "@mui/system";
import React from "react";
import {Container} from "@/app/[locale]/@selectedNote/[selectedNoteId]/page";
import {Check, Delete} from "@mui/icons-material";


export default function LoadingSelectedNote() {
    return (
        <Container styles="flex items-start justify-start gap-2">
            <Box className="flex flex-col h-full w-full gap-2">
                <Typography variant="h1" className="w-1/3">
                    <Skeleton/>
                </Typography>
                {
                    Array.from({length: 5}).map((_, i) =>
                        <Typography variant="body1" key={i}>
                            <Skeleton/>
                        </Typography>
                    )
                }
                <Typography variant="caption">
                    <Skeleton/>
                </Typography>
            </Box>
            <Skeleton variant="circular" className="shrink-0">
                <IconButton>
                    <Check/>
                </IconButton>
            </Skeleton>
            <Skeleton variant="circular" className="shrink-0">
                <IconButton>
                    <Delete/>
                </IconButton>
            </Skeleton>
        </Container>
    );
}