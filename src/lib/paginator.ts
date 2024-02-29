import { Client, Events } from "discord.js";
import { client } from "../app";
import { Database, db } from "./database";

type Table = keyof Database;

abstract class Paginator {

    id: string;
    table: Table;
    limit: number;

    private page: number = 0;

    constructor (id: string, table: Table, limit: number = 10) {
        this.id = id;
        this.table = table;
        this.limit = limit;
    }

    next = () => {
        this.page++;
        return db.selectFrom(this.table)
            .selectAll()
            .offset(this.limit * this.page)
            .limit(this.limit)
            .execute();
    }

    last = () => {
        this.page--;
        return db.selectFrom(this.table)
            .selectAll()
            .offset(this.limit * this.page)
            .limit(this.limit)
            .execute();
    }

    display = (client: Client) => {
        // overload this
    }
    
}

const paginators: Paginator[] = [];

client.on(Events.MessageReactionAdd, async event => {
    const message = event.message;
    const paginator = paginators.find(paginator => paginator.id = message.id);
    if (paginator) {
        const reaction = event.emoji.name;
        if (reaction === ":track_next:") {
            console.log("clicked!");
        }
    }
});

export const createPaginator = () => {

}