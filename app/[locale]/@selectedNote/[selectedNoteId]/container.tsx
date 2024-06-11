import React from "react";
import {Paper} from "@mui/material";

export function Container({children, styles}: { children?: React.ReactNode, styles?: string }) {
    return (
        <Paper className={styles + " w-3/4 p-4 m-10"} elevation={3} id="maximized-container">
            {children}
        </Paper>
    )
}