import { sql } from "kysely";
import { db } from "./lib/database";

(async () => {
    await db.schema.createTable("voice")
        .addColumn("id", "integer", cb => cb.primaryKey().autoIncrement())
        .addColumn("guild_id", "varchar(20)", cb => cb.notNull())
        .addColumn("user_id", "varchar(20)", cb => cb.notNull())
        .addColumn("search", "text", cb => cb.notNull())
        .addColumn("video_url", "varchar(100)", cb => cb.notNull())
        .addColumn("video_name", "text", cb => cb.notNull())
        .addColumn("created", "timestamp", cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .ifNotExists()
        .execute()
        .catch(e => console.log(e));

    await db.schema.createTable("roles")
        .addColumn("id", "integer", cb => cb.primaryKey().autoIncrement())
        .addColumn("guild_id", "varchar(20)", cb => cb.notNull())
        .addColumn("user_id", "varchar(20)", cb => cb.notNull())
        .addColumn("role", "integer", cb => cb.notNull())
        .ifNotExists()
        .execute()
        .catch(e => console.log(e));

    await db.schema.createTable("memes")
        .addColumn("id", "integer", cb => cb.primaryKey().autoIncrement())
        .addColumn("guild_id", "varchar(20)", cb => cb.notNull())
        .addColumn("user_id", "varchar(20)", cb => cb.notNull())
        .addColumn("top", "varchar(100)")
        .addColumn("bottom", "varchar(100)")
        .addColumn("image_url", "text", cb => cb.notNull())
        .addColumn("created", "timestamp", cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .execute()
        .catch(e => console.log(e));
})();