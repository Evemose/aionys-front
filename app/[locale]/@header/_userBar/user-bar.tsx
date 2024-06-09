import {getCurrentUser} from "@/app/_models/User";
import LoggedInBar from "@/app/[locale]/@header/_userBar/logged-in";
import {LoginButton} from "@/app/[locale]/@header/_userBar/login-button";

export default async function UserBar() {
    try {
        return <LoggedInBar user={await getCurrentUser()}/>
    } catch (ignored) {
        // User is not logged in
        return <LoginButton/>
    }
}


