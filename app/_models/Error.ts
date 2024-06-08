export default class ErrorResponse {
    field: string;
    message: string;

    constructor(field: string, message: string) {
        this.field = field;
        this.message = message;
    }

    toMapEntry(): [string, string] {
        return [this.field, this.message];
    }
}