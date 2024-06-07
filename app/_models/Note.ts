
export default class Note {
    private readonly _id: number;
    private _title: string;
    private _content: string;
    private readonly _createdAt: Date;
    private readonly _lastModifiedAt: Date;

    constructor(id: number, title: string, content: string, createdDate: Date, lastModifiedDate: Date) {
        this._id = id;
        this._title = title;
        this._content = content;
        this._createdAt = createdDate;
        this._lastModifiedAt = lastModifiedDate;
    }

    public get title(): string {
        return this._title;
    }

    public get content(): string {
        return this._content;
    }

    public get id(): number {
        return this._id;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get lastModifiedAt(): Date {
        return this._lastModifiedAt;
    }

    public set title(title: string) {
        this._title = title;
    }

    public set content(content: string) {
        this._content = content;
    }
}

export function useNotes() {
    // TODO: Fetch notes from the server
    const shiftedDate = new Date();
    shiftedDate.setDate(shiftedDate.getDate() + 1);
    return [
        new Note(1, "First note", "This is the first note", new Date(), new Date()),
        new Note(2, "Second note", "This is the second note", new Date(), new Date()),
        new Note(3, "Third note", "This is the third note", new Date(), shiftedDate),
        new Note(4, "Fourth note", "This is the fourth note", new Date(), new Date()),
        new Note(5, "Fifth note", "This is the fifth note", new Date(), new Date()),
        new Note(6, "Sixth note", "This is the sixth note", new Date(), new Date()),
        new Note(7, "Seventh note", "This is the seventh note", new Date(), new Date()),
        new Note(8, "Eighth note", "This is the eighth note", new Date(), new Date()),
    ];
}
