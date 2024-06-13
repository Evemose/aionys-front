export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// js date API is just horrible
export function toNormalDateFormat(date: Date): string {
    const dateOptions = {
        hour: '2-digit', minute: '2-digit', day: "2-digit", month: "2-digit", year: "numeric",
    } as Intl.DateTimeFormatOptions
    const str = date.toLocaleDateString([], dateOptions)
    return str.replaceAll("/", ".")
}