
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function getDefaultHeaders() {
    const headers = {
        'Content-Type': 'application/json',
    } as {
        [key: string]: string
    }
    if (typeof window === 'undefined') {
        const {cookies} = require('next/headers');
        headers['Cookie'] = cookies().toString();
    }
    if (process.env.NEXT_PUBLIC_ACTIVE_PROFILE === "dev" && typeof localStorage !== 'undefined') {
        headers['Authorization'] = "Bearer " + localStorage.getItem('token') || '';
    }
    return headers;
}

export const post = async (url: string, body?: any, auth?: string) => {
    const headers = getDefaultHeaders();
    if (auth) {
        headers['Authorization'] = auth;
    }
    return fetch(BACKEND_URL + url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        credentials: 'include'
    });
}

export const get = async (url: string) => {
    console.log('fetching', BACKEND_URL + url);
    return fetch(BACKEND_URL + url, {
        method: 'GET',
        credentials: 'include',
        headers: getDefaultHeaders()
    });
}

export const patch = async (url: string, body: any) => {
    return fetch(BACKEND_URL + url, {
        method: 'PATCH',
        headers: getDefaultHeaders(),
        body: JSON.stringify(body),
        credentials: 'include'
    });
}

export const del = async (url: string) => {
    return fetch(BACKEND_URL + url, {
        method: 'DELETE',
        headers: getDefaultHeaders(),
        credentials: 'include'
    });

}

