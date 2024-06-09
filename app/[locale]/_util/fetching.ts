const BACKEND_URL = 'http://localhost:8080';

async function getDefaultHeaders() {
    const headers = {
        'Content-Type': 'application/json',
    } as {
        [key: string]: string
    }
    const authCookie = await getAuthCookie();
    if (authCookie) {
        headers['Cookie'] = `${authCookie.name}=${authCookie.value}`;
    }
    return headers;
}

export const post = async (url: string, body?: any, auth?: string) => {
    const headers = await getDefaultHeaders();
    if (auth) {
        headers['Authorization'] = auth;
    }
    return fetch(BACKEND_URL + url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        credentials: auth ? 'omit' : 'include'
    });
}

export const get = async (url: string) => {
    return fetch(BACKEND_URL + url, {
        method: 'GET',
        credentials: 'include',
        headers: await getDefaultHeaders()
    });
}

export const patch = async (url: string, body: any) => {
    return fetch(BACKEND_URL + url, {
        method: 'PATCH',
        headers: await getDefaultHeaders(),
        body: JSON.stringify(body),
        credentials: 'include'
    });
}

export const del = async (url: string) => {
    return fetch(BACKEND_URL + url, {
        method: 'DELETE',
        headers: await getDefaultHeaders(),
        credentials: 'include'
    });

}

async function getAuthCookie() {
    if (typeof window === 'undefined') {
        const cookies = (await import('next/headers')).cookies();
        return cookies.get('Bearer');
    }
    return null;
}

