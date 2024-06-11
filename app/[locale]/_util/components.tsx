import {Box, Typography} from "@mui/material";
import React from "react";
import {cookies} from "next/headers";
import {getScopedI18n} from "@/config/locales/server";

export async function LoggedInOnlyContainer({children}: { children: React.ReactNode }) {
    const scopedT = await getScopedI18n("commons" as never);
    if (!cookies().get("BearerTail")) {
        return (
            <Box className="flex justify-center items-center h-full text-center">
                <Typography variant="h3">{scopedT("mustBeLoggedIn" as never, {count: 0 as never})}</Typography>
            </Box>
        );
    }
    return <>{children}</>
}

