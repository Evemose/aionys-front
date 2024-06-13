import {Box} from "@mui/system";
import {Skeleton} from "@mui/material";
import React, {useEffect} from "react";
import {Username} from "@/app/[locale]/@header/_userBar/user-options";
import {useGet} from "@/app/[locale]/_util/fetching-client";
import {create} from "zustand";
import User from "@/app/_models/User";
import {ProfilePicture} from "@/app/[locale]/@header/_userBar/profile-picture";

export const useUser = create<{
    user: User | null,
    readonly set: (user: User) => void
}>((set) => ({
    user: null,
    set: (user) => set({user})
}));

export default function LoggedInBar() {
    const {data: user, isLoading} = useGet("/me")
    const {user: stateUser, set} = useUser(state => {
        return {user: state.user, set: state.set}
    });

    useEffect(() => {
        set(user)
    }, [set, user]);
    
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
            <ProfilePicture profilePicture={stateUser?.profilePicture}/>
            <Username name={stateUser?.username ?? ""}/>
        </Box>
    )
}