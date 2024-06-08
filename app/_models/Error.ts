import {capitalizeFirstLetter} from "@/app/[locale]/_util/misc";

export default class ErrorResponse {
    field: string;
    message: string;

    constructor(field: string, messages: string) {
        this.field = field;
        this.message = messages;
    }

    toMapEntry(): [string, string] {
        return [this.field, this.message];
    }
}

export function toMap(errors: ErrorResponse[]): Map<string, string[]> {
    const newErrors = new Map();
    for (const error of errors) {
        if (newErrors.has(error.field)) {
            newErrors.get(error.field)!.push(capitalizeFirstLetter(error.message));
        } else {
            newErrors.set(error.field, [capitalizeFirstLetter(error.message)]);
        }
    }
    return newErrors;
}