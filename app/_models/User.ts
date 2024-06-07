import {createContext, useContext} from "react";

export default class User {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _profilePicture: string;

    constructor(id: number, name: string, profilePicture: string) {
        this._id = id;
        this._name = name;
        this._profilePicture = profilePicture;
    }

    public get name(): string {
        return this._name;
    }

    public get profilePicture(): string {
        return this._profilePicture;
    }

    public get id(): number {
        return this._id;
    }
}

const defaultContext = {
    user: null as User | null,
    setUser: (user: User) => {
         throw new Error("UserContext not initialized")
    }
} as {
    user: User | null,
    setUser: (user: User) => void
}

export const UserContext = createContext(defaultContext);

export function useUser() {
    const {user} = useContext(UserContext);
    return user;
}

export async function getCurrentUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        return JSON.parse(storedUser);
    }
}