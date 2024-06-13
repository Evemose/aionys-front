"use client"

import React, {useRef, useState} from "react";
import {Button, Menu, MenuItem, Typography} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import Cookie from "js-cookie";
import {useRouter} from "next/navigation";
import {useScopedI18n} from "@/config/locales/client";
import {useSWRConfig} from "swr";
import {useLoggedIn} from "@/app/[locale]/@header/_userBar/user-bar";

function LogoutButton() {
    const router = useRouter();
    const scopedT = useScopedI18n("loginRegister");
    const {mutate} = useSWRConfig();
    const setLoggedIn = useLoggedIn(state => state.setLoggedIn);

    return <Button className="normal-case w-full justify-start" variant="outlined">
        <Typography variant="body1" onClick={(e) => {
            e.preventDefault();
            // clear cache because otherwise SWR will treat first request as still authenticated
            // and use old cookies for some reason
            mutate(
                _ => true,
                undefined,
                {revalidate: false}
            ).then(() => {
                setLoggedIn(false);
                Cookie.remove("BearerTail");
                if (process.env.NEXT_PUBLIC_ACTIVE_PROFILE === "dev") {
                    localStorage.removeItem("token");
                }
                router.refresh();
            });
        }}>{scopedT("logout")}</Typography>
    </Button>;
}

export function Username({name}: { name: string }) {
    const [expanded, setExpanded]
        = useState(false);
    const [anchorEl, setAnchorEl]
        = useState<HTMLElement | null>(null);
    const expandIconScale = expanded ? "scale-y-[-1]" : "";
    const usernameRef = useRef<HTMLDivElement>(null);

    return (
        <>
            { /* @ts-ignore */}
            <Button onClick={(e) => {
                setExpanded(!expanded);
                setAnchorEl(e.currentTarget);
            }} className="normal-case" ref={usernameRef}>
                <Typography>{name}</Typography>
                <ExpandMore className={"transition ease-in-out duration-300 rotate-[270deg] " + expandIconScale}/>
            </Button>
            <UserMenu expanded={expanded} setExpanded={setExpanded} anchorEl={anchorEl!} usernameRef={usernameRef}>
                <MenuItem className="p-0">
                    <LogoutButton/>
                </MenuItem>
            </UserMenu>
        </>
    )
}

function UserMenu(
    {
        children,
        expanded,
        setExpanded,
        anchorEl,
        usernameRef
    }: {
        children: React.ReactNode,
        expanded: boolean,
        setExpanded: (value: boolean) => void,
        anchorEl: HTMLElement,
        usernameRef: React.RefObject<HTMLDivElement>
    }
) {
    return (
        <Menu open={expanded}
              anchorEl={anchorEl}
              anchorOrigin={{vertical: "top", horizontal: "right"}}
              transformOrigin={{
                  vertical: "center",
                  horizontal: "left"
              }}
              elevation={0}
              onClose={() => {
                  setExpanded(false);
              }}
              slotProps={{
                  paper: {
                      style: {
                          height: usernameRef.current?.clientHeight,
                          paddingLeft: 10
                      },
                  }
              }}
              className="flex items-center"
              MenuListProps={{
                  className: "p-0"
              }}
        >
            {children}
        </Menu>
    )
}