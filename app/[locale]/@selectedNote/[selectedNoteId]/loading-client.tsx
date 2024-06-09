import {IconButton, Skeleton, Typography} from "@mui/material";
import {Box} from "@mui/system";
import React from "react";
import {Check, Delete} from "@mui/icons-material";
import {Container} from "@/app/[locale]/@selectedNote/[selectedNoteId]/page";


function Skeletons() {
    return <>
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
    </>;
}

export default function LoadingSelectedNote({box}: { box?: boolean }) {
    const styles = "flex items-start gap-2";
    return box ?
        <Box className={styles}>
            <Skeletons/>
        </Box> :
        <Container styles={styles}>
            <Skeletons/>
        </Container>
}