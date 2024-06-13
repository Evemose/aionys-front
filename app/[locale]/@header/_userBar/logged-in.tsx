import {Box} from "@mui/system";
import {Avatar, Skeleton} from "@mui/material";
import {Suspense} from "react";
import Image from "next/image";
import {Username} from "@/app/[locale]/@header/_userBar/user-options";
import {useGet} from "@/app/[locale]/_util/fetching-client";

async function ProfilePicture({profilePicture}: { profilePicture?: string }) {
    return (
        profilePicture ?
            <Image src={profilePicture} alt={"Profile picture"} width={50} height={50}/> :
            <Avatar/>
    );
}

export default function LoggedInBar() {
    const {data: user, isLoading} = useGet("/me")
    if (isLoading) {
        return (
            <Box className="flex gap-4">
                <Skeleton variant="circular" width={40} height={40}/>
                <Skeleton variant="text" width={100}/>
            </Box>
        )
    }
    return (
        <Box className="flex items-center gap-4">
            <Suspense fallback={<Skeleton variant="circular" width={50} height={50}/>}>
                <ProfilePicture profilePicture={user?.profilePicture}/>
            </Suspense>
            <Username name={user?.username}/>
        </Box>
    )
}