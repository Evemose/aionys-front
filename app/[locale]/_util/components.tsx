import {Box, FormHelperText, Typography} from "@mui/material";
import React from "react";

export function ErrorFormHelper({errors, field}: { errors: Map<string, string[]>, field: any }) {
    return <>
        {
            errors.has(field) &&
            <FormHelperText error id={`${field}-helper`}>
                {errors.get(field)!.map((error, index) =>
                    <Typography key={index} variant="caption">{error}</Typography>)}
            </FormHelperText>
        }
    </>;
}

export async function LoggedInOnlyContainer({children}: { children: React.ReactNode }) {
    const cookies = (await import("next/headers")).cookies();
    if (!cookies.get("BearerTail")) {
        return (
            <Box className="flex justify-center items-center h-full">
                <Typography variant="h3">You must be logged in to access this page.</Typography>
            </Box>
        );
    }
    return <>{children}</>
}