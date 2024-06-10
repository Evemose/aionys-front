"use client"

import React, {useState} from "react";
import {useScopedI18n} from "@/config/locales/client";
import {post} from "@/app/[locale]/_util/fetching";
import ErrorResponse, {toMap} from "@/app/_models/Error";
import {Backdrop, Button, TextField, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {useRouter} from "next/navigation";

import {ErrorFormHelper} from "@/app/[locale]/_util/components";

const enum BackdropType {
    Login = "login",
    Register = "register",
    None = "none"
}

const login = async (
    form: HTMLFormElement,
    router: any,
    setCurrentBackdrop: (value: BackdropType) => void,
    handleErrors: (response: Response) => Promise<void>
) => {
    const formData = new FormData(form);
    const response = await post("/login", {},
        `Basic ${btoa(`${formData.get("username")}:${formData.get("password")}`)}`);

    if (!response.ok) {
        await handleErrors(response);
        return;
    }

    setCurrentBackdrop(BackdropType.None);
    router.refresh();
};

function useLoginHandler(
    setErrors: (value: Map<string, string[]>) => void,
    setCurrentBackdrop: (value: BackdropType) => void,
    ) {
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
        await login(e.currentTarget, router, setCurrentBackdrop, handleErrors);
    }
}

export function LoginButton() {
    const [currentBackdrop, setCurrentBackdrop]
        = useState<BackdropType>(BackdropType.None);
    const scopedT = useScopedI18n("loginRegister");
    return (
        <>
            <Button onClick={() => setCurrentBackdrop(BackdropType.Login)} variant="contained">
                {scopedT("login")}
            </Button>
            <Backdrop open={currentBackdrop !== BackdropType.None}
                      onClick={() => setCurrentBackdrop(BackdropType.None)}>
                {
                    currentBackdrop === BackdropType.Login && <LoginForm setCurrentBackdrop={setCurrentBackdrop}/>
                }
                {
                    currentBackdrop === BackdropType.Register && <RegisterForm setCurrentBackdrop={setCurrentBackdrop}/>
                }
            </Backdrop>
        </>
    )
}

function useRegisterHandler(
    setErrors: (value: Map<string, string[]>) => void,
    setCurrentBackdrop: (value: BackdropType) => void) {
    const router = useRouter();

    async function handleErrors(response: Response) {
        if (response.status == 400 || response.status == 409) {
            const errors = await response.json() as ErrorResponse[];
            setErrors(toMap(errors));
        } else {
            console.log(response);
            throw new Error("Unexpected error");
        }
    }

    return async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const response = await post("/register", {
            username: formData.get("username"),
            password: formData.get("password")
        });

        if (!response.ok) {
            await handleErrors(response);
            return;
        }

        await login(form, router, setCurrentBackdrop, handleErrors);
    };
}

function RegisterForm(
    {
        setCurrentBackdrop
    }: {
        setCurrentBackdrop: (value: BackdropType) => void
    }
) {
    const [errors, setErrors] = useState<Map<string, string[]>>(new Map());
    const handleSubmit = useRegisterHandler(setErrors, setCurrentBackdrop);
    const scopedTLoginRegister = useScopedI18n("loginRegister");
    const scopedTUser = useScopedI18n("userFields")
    return (
        <Box onClick={(e) => e.stopPropagation()}
             className="bg-white w-[30dvw] h-[50dvh] rounded-xl flex justify-center items-center flex-col gap-2">
            <Typography variant="h5">{scopedTLoginRegister("registerTitle")}</Typography>
            <Box component="form" onSubmit={handleSubmit}
                 className="flex flex-col gap-2">
                <ErrorFormHelper errors={errors} field="username"/>
                <TextField name="username" label={scopedTUser("username")} aria-describedby="username-helper"/>
                <ErrorFormHelper errors={errors} field="password"/>
                <TextField name="password" label={scopedTUser("password")} aria-describedby="password-helper"/>
                <Button variant="contained" type="submit">{scopedTLoginRegister("register")}</Button>
            </Box>
            <Button variant="text" style={{
                textTransform: "none",
            }} onClick={() => setCurrentBackdrop(BackdropType.Login)}>
                {scopedTLoginRegister("alreadyHaveAnAccount")}
            </Button>
        </Box>
    )
}

function LoginForm(
    {
        setCurrentBackdrop
    }: {
        setCurrentBackdrop: (value: BackdropType) => void
    }
) {
    const [errors, setErrors]
        = useState<Map<string, string[]>>(new Map());
    const handleSubmit = useLoginHandler(setErrors, setCurrentBackdrop);
    const scopedTLoginRegister = useScopedI18n("loginRegister");
    const scopedTUser = useScopedI18n("userFields");
    return (
        <Box onClick={(e) => e.stopPropagation()}
             className="bg-white w-[30dvw] h-[50dvh] rounded-xl flex justify-center items-center flex-col gap-2">
            <Typography variant="h5">{scopedTLoginRegister("login")}</Typography>
            <Box component="form" onSubmit={handleSubmit}
                 className="flex flex-col gap-2">
                <ErrorFormHelper errors={errors} field="username"/>
                <TextField name="username" label={scopedTUser("username")} aria-describedby="username-helper"/>
                <ErrorFormHelper errors={errors} field="password"/>
                <TextField name="password" label={scopedTUser("password")} aria-describedby="password-helper"/>
                <Button variant="contained" type="submit">{scopedTLoginRegister("login")}</Button>
            </Box>
            <Button variant="text" style={{
                textTransform: "none",
            }} onClick={() => setCurrentBackdrop(BackdropType.Register)}>
                {scopedTLoginRegister("dontHaveAnAccount")}
            </Button>
        </Box>
    )
}