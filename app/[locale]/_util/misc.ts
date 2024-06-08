
export function getPathSegments(pathname: string): string[] {
    return pathname.split("/").filter(s => s.length > 0);
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}