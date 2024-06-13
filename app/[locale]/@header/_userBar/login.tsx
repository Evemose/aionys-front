"use client"

import React, {useState} from "react";
import {useScopedI18n} from "@/config/locales/client";
import {post} from "@/app/[locale]/_util/fetching";
import ErrorResponse, {toMap} from "@/app/_models/Error";
import {Backdrop, Button, IconButton, Stack, TextField, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {useRouter} from "next/navigation";

import {ErrorFormHelper} from "@/app/[locale]/_util/components-client";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useLoggedIn} from "@/app/[locale]/@header/_userBar/user-bar";
import {Check, Close, Visibility, VisibilityOff} from "@mui/icons-material";
import {breakpoints} from "@/config/theme";
import {useWindowSize} from "@/app/[locale]/_util/hooks";

const enum BackdropType {
    Login = "login",
    Register = "register",
    None = "none"
}

const login = async (
    form: HTMLFormElement,
    router: AppRouterInstance,
    setCurrentBackdrop: (value: BackdropType) => void,
    handleErrors: (response: Response) => Promise<void>,
    setLoggedIn: (value: boolean) => void
) => {
    const formData = new FormData(form);
    const response = await post("/login", {},
        `Basic ${btoa(`${formData.get("username")}:${formData.get("password")}`)}`);
    if (!response.ok) {
        await handleErrors(response);
        return;
    }
    setCurrentBackdrop(BackdropType.None);

    if (process.env.NEXT_PUBLIC_ACTIVE_PROFILE === "dev") {
        const token = await response.text();
        // this is NOT SECURE in any possible way and auth should only rely on httpOnly cookies
        // unfortunately, when ran in docker, server and client are on different hosts
        // so cookies require SameSite=None and Secure, which require HTTPS
        // for production purposes, it is recommended to use https connection and httpOnly cookies
        localStorage.setItem("token", token);
    }
    setLoggedIn(true);
    router.refresh();
};

function useLoginHandler(
    setErrors: (value: Map<string, string[]>) => void,
    setCurrentBackdrop: (value: BackdropType) => void,
) {
    const router = useRouter();
    const setLoggedIn = useLoggedIn(state => state.setLoggedIn);

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
        await login(e.currentTarget, router, setCurrentBackdrop, handleErrors, setLoggedIn);
    }
}

export function Login() {
    const [currentBackdrop, setCurrentBackdrop]
        = useState<BackdropType>(BackdropType.None);
    const scopedT = useScopedI18n("loginRegister");
    return (
        <>
            <Button id="login" onClick={() => setCurrentBackdrop(BackdropType.Login)} variant="contained">
                {scopedT("login")}
            </Button>
            <Backdrop
                id="login-register-backdrop"
                open={currentBackdrop !== BackdropType.None}
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
    const setLoggedIn = useLoggedIn(state => state.setLoggedIn);

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

        if (formData.get("password") !== formData.get("passwordConfirmation")) {
            setErrors(new Map([["passwordConfirmation", ["Passwords do not match"]]]));
            return;
        }

        const response = await post("/register", {
            username: formData.get("username"),
            password: formData.get("password")
        });

        if (!response.ok) {
            await handleErrors(response);
            return;
        }

        await login(form, router, setCurrentBackdrop, handleErrors, setLoggedIn);
    };
}

const mdUp = {
    height: {
        errors: "h-[60dvh]",
        noErrors: "h-[50dvh]"
    },
    width: {
        errors: "w-[40dvw]",
        noErrors: "w-[30dvw]"
    }
}

const mdDown = {
    height: {
        errors: "h-[80dvh]",
        noErrors: "h-[70dvh]"
    },
    width: {
        errors: "w-[80dvw]",
        noErrors: "w-[70dvw]"
    }
}

function Container(
    {
        children,
        errorsPresent,
        heightVariants
    }: {
        children: React.ReactNode, errorsPresent: boolean,
        heightVariants?: { errors: string, noErrors: string }
    }) {
    const currentDimensions = useWindowSize()[0] > breakpoints.values.md ? mdUp : mdDown;
    return (
        <Box onClick={(e) => e.stopPropagation()}
             className={`bg-white 
                 ${errorsPresent ?
                 `${currentDimensions.width.errors} ${heightVariants?.errors ?? currentDimensions.height.errors}` :
                 `${currentDimensions.width.noErrors} ${heightVariants?.noErrors ?? currentDimensions.height.noErrors}`}  
                     rounded-xl flex justify-center items-center flex-col gap-2`}>
            {children}
        </Box>
    );
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
    const [passwordValue, setPasswordValue] = useState("");

    return (
        <Container errorsPresent={errors.size > 0} heightVariants={{
            errors: "h-[80dvh]",
            noErrors: "h-[70dvh]"
        }}>
            <Typography variant="h5">{scopedTLoginRegister("registerTitle")}</Typography>
            <Box component="form" onSubmit={handleSubmit}
                 className="flex flex-col gap-2 w-4/5">
                <SharedFields errors={errors} setPasswordValue={setPasswordValue}/>
                <PasswordChecklist passwordValue={passwordValue}/>
                <ErrorFormHelper errors={errors} field={"passwordConfirmation"}
                                 fieldNameSource={useScopedI18n("userFormFields") as (field: string) => string}/>
                <PasswordInput label="passwordConfirmation"/>
                <Button variant="contained" type="submit">{scopedTLoginRegister("register")}</Button>
            </Box>
            <Button variant="text" style={{
                textTransform: "none",
            }} onClick={() => setCurrentBackdrop(BackdropType.Login)}>
                {scopedTLoginRegister("alreadyHaveAnAccount")}
            </Button>
        </Container>
    )
}

function PasswordInput({label, setPasswordValue}: { label: string, setPasswordValue?: (value: string) => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const scopedT = useScopedI18n("userFormFields");

    return <TextField name={label}
                      onChange={(e) => {
                          if (setPasswordValue) {
                              setPasswordValue(e.target.value ?? "");
                          }
                      }}
                      label={scopedT(label as never)}
                      aria-describedby="password-helper"
                      InputProps={{
                          endAdornment: (
                              <IconButton onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <VisibilityOff/> : <Visibility/>}
                              </IconButton>
                          ),
                          type: showPassword ? "text" : "password",
                      }}
    />;
}

function PasswordChecklist({passwordValue}: { passwordValue: string }) {
    const scopedT
        = useScopedI18n("loginRegister.passwordRequirements");
    if (passwordValue.length === 0) {
        return null;
    }
    return (
        <Stack gap={0.05}>
            <ChecklistItem checked={passwordValue.length >= 8} text={scopedT("length")}/>
            <ChecklistItem checked={/[A-Z]/.test(passwordValue)} text={scopedT("uppercase")}/>
            <ChecklistItem checked={/[a-z]/.test(passwordValue)} text={scopedT("lowercase")}/>
            <ChecklistItem checked={/[0-9]/.test(passwordValue)} text={scopedT("digit")}/>
            <ChecklistItem checked={/[^A-Za-z0-9]/.test(passwordValue)} text={scopedT("specialCharacter")}/>
        </Stack>
    );
}

function ChecklistItem({checked, text}: { checked: boolean, text: string }) {
    return (
        <Box className="flex gap-2 items-center">
            { /* @ts-ignore */}
            {checked ? <Check color="success" fontSize="12px"/> : <Close color="error" fontSize="12px"/>}
            <Typography variant="caption" color={checked ? "green" : "red"}>{text}</Typography>
        </Box>
    );
}


function SharedFields(
    {
        errors,
        setPasswordValue,
    }: {
        errors: Map<string, string[]>,
        setPasswordValue?: (value: string) => void
    }) {
    const scopedT = useScopedI18n("userFormFields");
    return <>
        <ErrorFormHelper errors={errors} field="username"
                         fieldNameSource={scopedT as (field: string) => string}/>
        <TextField name="username" label={scopedT("username")} aria-describedby="username-helper"/>
        <ErrorFormHelper errors={errors} field="password"
                         fieldNameSource={scopedT as (field: string) => string}/>
        <PasswordInput label="password" setPasswordValue={setPasswordValue}/>
    </>;
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
    return (
        <Container errorsPresent={errors.size > 0}>
            <Typography variant="h5">{scopedTLoginRegister("login")}</Typography>
            <Box component="form" onSubmit={handleSubmit}
                 className="flex flex-col gap-2">
                <SharedFields errors={errors}/>
                <Button variant="contained" type="submit">{scopedTLoginRegister("login")}</Button>
            </Box>
            <Button variant="text" style={{
                textTransform: "none",
            }} onClick={() => setCurrentBackdrop(BackdropType.Register)}>
                {scopedTLoginRegister("dontHaveAnAccount")}
            </Button>
        </Container>
    )
}