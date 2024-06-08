import { z } from "zod";

export default class Note {
    readonly id: number;
    title: string;
    content: string;
    readonly createdAt: Date;
    readonly lastModifiedAt: Date;

    constructor(id: number, title: string, content: string, createdDate: Date, lastModifiedDate: Date) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdDate;
        this.lastModifiedAt = lastModifiedDate;
    }

    public static fromResponseData(data: any): Note {
        const schema = z.object({
            id: z.number(),
            title: z.string(),
            content: z.string(),
            createdAt: z.coerce.date(),
            lastModifiedAt: z.coerce.date(),
        });
        const result = schema.parse(data);
        return new Note(result.id, result.title, result.content, result.createdAt, result.lastModifiedAt);
    }
}

export function useNotes() {
    // TODO: Fetch @notesList from the server
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
