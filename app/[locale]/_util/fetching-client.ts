"use client"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

import useSWR from "swr";

function getAuthorizationHeader() {
    if (process.env.NEXT_PUBLIC_ACTIVE_PROFILE === "dev") {
        return {
            "Authorization": "Bearer " + localStorage.getItem("token") || "",
        }
    }
    return {};
}

export const useGet = (url: string) => {
    // @ts-ignore
    return useSWR(BACKEND_URL + url, (url) => fetch(url, {
            method: "GET",
            credentials: "include",
            // @ts-ignore
            headers: getAuthorizationHeader()
        }).then(response => response.json())
    );
}