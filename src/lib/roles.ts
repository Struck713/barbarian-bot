import { db } from "./database";

export enum Role {
    USER = 0,
    MODERATOR = 1,
    ADMINISTRATOR = 2,
}

export const getRole = async (guild_id: string, user_id: string) => {
    const rows = await db.selectFrom("roles")
        .select("role")
        .where("user_id", "=", user_id)
        .where("guild_id", "=", guild_id)
        .execute();

    if (rows.length > 0) return rows[0].role;
    return Role.USER;
}

export const setRole = async (guild_id: string, user_id: string, role: Role) => {
    return await db.insertInto("roles")
        .values({
            guild_id,
            user_id,
            role
        })
        .execute();
}

export const getNameFromRole = (role: Role) => {
    switch (role) {
        case Role.USER: return "User";
        case Role.MODERATOR: return "Moderator";
        case Role.ADMINISTRATOR: return "Administrator";
    }
}