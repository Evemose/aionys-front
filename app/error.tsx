"use client"

import {Alert, Box, Snackbar} from "@mui/material";

export default function Error({error, reset}: { error: any, reset: () => void }) {
    return <Snackbar>
        <Alert severity="error" onClose={reset}>
            {error}
        </Alert>
    </Snackbar>
}