"use client"

import Note from "@/app/_models/Note";

const BACKEND_URL = "http://localhost:8080";

import useSWR from "swr";

export const useGet = (url: string) => {
    // @ts-ignore
    return useSWR(BACKEND_URL + url, (url) => fetch(url, {
            method: "GET",
            credentials: "include"
        }).then(response => response.json())
    );
}