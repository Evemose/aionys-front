"use client"

import {useRef, useState} from "react";
import {
    Button,
    Menu,
    MenuItem,
    Typography
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import Cookie from "js-cookie";
import {useRouter} from "next/navigation";

export function Username({name}: { name: string }) {
    const [expanded, setExpanded]
        = useState(false);
    const [anchorEl, setAnchorEl]
        = useState<HTMLElement | null>(null);
    const expandIconScale = expanded ? "scale-y-[-1]" : "";
    const usernameRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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
                <MenuItem className="p-0">
                    <Button className="normal-case w-full justify-start" variant="outlined">
                        <Typography variant="body1" onClick={(e) => {
                            e.preventDefault();
                            Cookie.remove("BearerTail");
                            router.refresh();
                        }}>Logout</Typography>
                    </Button>
                </MenuItem>
            </Menu>
        </>
    )
}