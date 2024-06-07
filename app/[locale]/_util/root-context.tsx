"use client"

import User, {UserContext} from "@/app/_models/User";
import React, {useEffect, useState} from "react";
import {I18nProviderClient, useCurrentLocale} from "@/config/locales/client";

export default function RootContext({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const currentLocale = useCurrentLocale();

    useEffect(() => {
        setUser(getCurrentUser());
    }, [])

    return (
        <UserContext.Provider value={{user, setUser}}>
            <I18nProviderClient locale={currentLocale}>
                {children}
            </I18nProviderClient>
        </UserContext.Provider>
    )
}


function getCurrentUser(): User | null {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        return JSON.parse(storedUser);
    }
    // TODO: replace with null when userbar fetching is implemented
    return new User(
        1,
        'Anonymous',
        'https://cdn.worldvectorlogo.com/logos/next-js.svg'
    )
}