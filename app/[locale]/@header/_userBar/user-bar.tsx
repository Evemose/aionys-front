import {getCurrentUser} from "@/app/_models/User";
import LoggedInBar from "@/app/[locale]/@header/_userBar/logged-in";
import {LoginButton} from "@/app/[locale]/@header/_userBar/login-button";

export default async function UserBar() {
    const user = await getCurrentUser();
    return user ? <LoggedInBar user={user}/> : <LoginButton/>
}


