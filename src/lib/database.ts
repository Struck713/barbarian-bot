import SQLite from 'better-sqlite3'
import { Generated, Kysely, SqliteDialect } from 'kysely'
import { database } from '../../config.json'
import { Role } from './roles'

export interface Database {
    voice: VoiceTable,
    roles: RoleTable,
    memes: MemeTable
}

export interface VoiceTable {
    id: Generated<number>,
    guild_id: string,
    user_id: string,
    search: string,
    video_url: string,
    video_name: string,
    created?: Date
}

export interface RoleTable {
    id: Generated<number>,
    guild_id: string,
    user_id: string,
    role: Role
}

export interface MemeTable {
    id: Generated<number>,
    guild_id: string,
    user_id: string,
    top: string,
    bottom: string,
    image_url: string,
    created?: Date
}

const dialect = new SqliteDialect({
  database: new SQLite(database.path),
})

export const db = new Kysely<Database>({
  dialect,
})