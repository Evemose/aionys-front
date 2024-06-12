"use client"

import * as process from "node:process";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

import useSWR from "swr";

export const useGet = (url: string) => {
    // @ts-ignore
    return useSWR(BACKEND_URL + url, (url) => fetch(url, {
            method: "GET",
            credentials: "include",
        }).then(response => response.json())
    );
}