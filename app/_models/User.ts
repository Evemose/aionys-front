import {get} from "@/app/[locale]/_util/fetching";

export default class User {
    readonly id: number;
    readonly username: string;
    readonly profilePicture?: string;

    constructor(id: number, username: string, profilePicture?: string) {
        this.id = id;
        this.username = username;
        this.profilePicture = profilePicture;
    }
}


export async function getCurrentUser() {
    const response = await get("/me");
    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }
    return await response.json() as User;
}
