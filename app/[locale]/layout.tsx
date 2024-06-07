import "@/static/styles.css";
import React from "react";
import RootContext from "@/app/[locale]/_util/root-context";

export default function LocaleLayout(
    props: { children: React.ReactNode, header: React.ReactNode }
) {
    return (
        <html lang="en">
        <body className="h-dvh w-dvw overflow-x-clip">
        <RootContext>
            {props.header}
            {props.children}
        </RootContext>
        </body>
        </html>
    )
}
