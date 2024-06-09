"use client"

import React, {useState} from "react";
import {useScopedI18n} from "@/config/locales/client";
import {post} from "@/app/[locale]/_util/fetching";
import ErrorResponse, {toMap} from "@/app/_models/Error";
import {Backdrop, Button, TextField, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {useRouter} from "next/navigation";
// @ts-ignore
import Cookies from "js-cookie";

import {ErrorFormHelper} from "@/app/[locale]/_util/components";

function useLoginHandler(setErrors: (value: (((prevState: Map<string, string[]>) => Map<string, string[]>)
                             | Map<string, string[]>)) => void,
                         setShowLoginDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void) {
    const router = useRouter();

    async function handleErrors(response: Response) {
        if (response.status == 400) {
            const errors = await response.json() as ErrorResponse[];
            setErrors(toMap(errors));
        } else if (response.status == 401) {
            setErrors(new Map([["password", ["Invalid password"]]]));
        } else {
            throw new Error("Unexpected error");
        }
    }

    return async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        const response = await post("/login", {},
            `Basic ${btoa(`${username}:${password}`)}`);

        if (!response.ok) {
            await handleErrors(response);
            return;
        }

        setShowLoginDialog(false);

        const bearer = await response.text();
        document.cookie = `Bearer=${bearer};path=/;expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};samesite=strict`;
        router.refresh();
    };
}

export function LoginButton() {
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [errors, setErrors] = useState<Map<string, string[]>>(new Map());
    const scopedT = useScopedI18n("login");

    const handleSubmit = useLoginHandler(setErrors, setShowLoginDialog);

    return (
        <>
            <Button onClick={() => setShowLoginDialog(true)} variant="contained">
                {scopedT("login")}
            </Button>
            <Backdrop open={showLoginDialog} onClick={() => setShowLoginDialog(false)}>
                <Box onClick={(e) => e.stopPropagation()}
                     className="bg-white w-[30dvw] h-[50dvh] rounded-xl flex justify-center items-center flex-col gap-2">
                    <Typography variant="h5">{scopedT("login")}</Typography>
                    <Box component="form" onSubmit={handleSubmit}
                         className="flex flex-col gap-2">
                        <ErrorFormHelper errors={errors} field="username"/>
                        <TextField name="username" label={scopedT("username")} aria-describedby="username-helper"/>
                        <ErrorFormHelper errors={errors} field="password"/>
                        <TextField name="password" label={scopedT("password")} aria-describedby="password-helper"/>
                        <Button variant="contained" type="submit">{scopedT("login")}</Button>
                    </Box>
                </Box>
            </Backdrop>
        </>
    )
}