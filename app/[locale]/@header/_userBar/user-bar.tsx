"use client"

import {useUser} from "@/app/_models/User";
import {Button} from "@mui/base";
import LoggedInBar from "@/app/[locale]/@header/_userBar/logged-in";

export default function UserBar() {
    const user = useUser();
    return user ? <LoggedInBar user={user} /> : <LoginButton />
}


function LoginButton() {
    return <Button onClick={() => alert("There will be login")} />
}
