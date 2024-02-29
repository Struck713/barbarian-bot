import { sql } from "kysely";
import { db } from "./lib/database";
import { REST, Routes } from "discord.js";
import commands from "./commands";
import { development, token } from "../config.json";

const deploy = () => {
    const rest = new REST().setToken(token);
    return rest.put(Routes.applicationCommands(development.application_id), { body: commands.map(command => command.metadata) }).catch(e => e.rawError.errors) as any;
}

(async () => {
    console.log("Deploying slash commands..");
    // await deploy();

    console.log("Setting up SQLite..");
    console.log("Creating 'voice' table..");
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

    console.log("Creating 'roles' table..");
    await db.schema.createTable("roles")
        .addColumn("id", "integer", cb => cb.primaryKey().autoIncrement())
        .addColumn("guild_id", "varchar(20)", cb => cb.notNull())
        .addColumn("user_id", "varchar(20)", cb => cb.notNull())
        .addColumn("role", "integer", cb => cb.notNull())
        .ifNotExists()
        .execute()
        .catch(e => console.log(e));

    console.log("Creating 'memes' table..");
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

    console.log("You're ready to go! Run 'npm start' to start the bot.");
    process.exit();
})();

