"use client"

import LoggedInBar from "@/app/[locale]/@header/_userBar/logged-in";
import {Login} from "@/app/[locale]/@header/_userBar/login";
import {create} from "zustand";
import {useEffect} from "react";

export const useLoggedIn = create<{
    loggedIn: boolean,
    readonly setLoggedIn: (value: boolean) => void,
    loginSet: boolean
}>((set) => ({
        loggedIn: false,
        setLoggedIn: (value: boolean) => set({loggedIn: value, loginSet: true}),
        loginSet: false
    })
);

// can be converted to a server component if auth cookies are available
export default function UserBar() {
    const {loggedIn, setLoggedIn, loginSet} = useLoggedIn(state => {
        return {
            loggedIn: state.loggedIn,
            setLoggedIn: state.setLoggedIn,
            loginSet: state.loginSet
        }
    });
    useEffect(() => {
        setLoggedIn(localStorage.getItem("token") !== null);
    }, [setLoggedIn]);


    if (loggedIn) {
        return <LoggedInBar />
    }

    // wait useEffect to set login state
    if (!loginSet) {
        return <div></div>;
    }

    return <Login/>
}


