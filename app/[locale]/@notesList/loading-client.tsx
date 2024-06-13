import {Skeleton} from "@mui/material";
import React from "react";
import {Container} from "@/app/[locale]/@notesList/page";


export default function LoadingSelectedNote() {
    return (
        <Container>
            <Skeleton variant="rectangular" height={50}/>
            <Skeleton variant="rectangular" height={50}/>
            {
                Array.from({length: 5}, (_, i) =>
                    <Skeleton key={i} variant="rectangular" height={100} width="100%" className="rounded-3xl"/>
                )
            }
        </Container>
    );
}