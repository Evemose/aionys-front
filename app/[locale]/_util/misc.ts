
export function getPathSegments(pathname: string): string[] {
    return pathname.split("/").filter(s => s.length > 0);
}