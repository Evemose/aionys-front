import User from "@/app/_models/User";
import {Box} from "@mui/system";
import {Avatar, Skeleton} from "@mui/material";
import {Suspense, useState} from "react";
import Image from "next/image";

async function ProfilePicture({profilePicture}: { profilePicture: string }) {
    return <Image src={profilePicture} alt={"Profile picture"} width={50} height={50}/>
}

function Username(props: { name: string }) {
    return (
        <span>{props.name}</span>
    )
}

export default function LoggedInBar({user}: { user: User }) {
    return (
        <Box className="flex items-center gap-4">
            <Suspense fallback={<Skeleton variant="circular" width={50} height={50}/>}>
                <ProfilePicture profilePicture={user.profilePicture}/>
            </Suspense>
            <Username name={user.name}/>
        </Box>
    )
}