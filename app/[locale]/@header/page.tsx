import React from "react";
import {Paper} from "@mui/material";
import UserBar from "@/app/[locale]/@header/_userBar/user-bar";
import LanguageSelector from "@/app/[locale]/@header/language-selector";

export default function Page() {
    return <Paper className="flex justify-between w-full pr-10 items-center h-[11%] pl-4" elevation={10}>
        <UserBar />
        <LanguageSelector />
    </Paper>
}