import "@/static/styles.css";
import React from "react";


export default function LocaleLayout(
    props: { children: React.ReactNode }
) {
    return (
        <html lang="en">
        <body>
        {props.children}
        </body>
        </html>
    )
}
