import fs from "fs";
import { get } from "http";

export enum PermissionLevel {
    MEMBER = 0,
    ADMIN = 1,
}

export const getNameFromPermissionLevel = (level: PermissionLevel) => {
    switch (level) {
        case PermissionLevel.MEMBER: return "MEMBER";
        case PermissionLevel.ADMIN: return "ADMIN";
    }
}

class PermissionManager {
    private table: Map<string, Map<string, PermissionLevel>>;

    constructor() {
        this.table = this.loadPermissions();
    }

    public setPermissionLevel(guildId: string, userId: string, level: PermissionLevel) {
        let guildPermissions = this.table.get(guildId);
        if (guildPermissions) {
            guildPermissions.set(userId, level);
        } else {
            guildPermissions = new Map();
            guildPermissions.set(userId, level);
            this.table.set(guildId, guildPermissions);
        }
    }

    public getPermissionLevel(guildId: string, userId: string) {
        let guildPermissions = this.table.get(guildId);
        if (guildPermissions) 
            return guildPermissions.get(userId) || PermissionLevel.MEMBER;
        
        return PermissionLevel.MEMBER;
    }

    public savePermissions = () => {
        let output: any = {};
        this.table.forEach((value, key) => {
            output[key] = Array.from(value.entries()).map(([user, level]) => ({ user, level }));
        });
        fs.writeFileSync("permissions.json", JSON.stringify(output));
    }

    private loadPermissions = () => {
        if (!fs.existsSync("permissions.json")) {
            fs.writeFileSync("permissions.json", JSON.stringify([]));
        }
        
        // do flat file for now
        const permissions: Map<string, Map<string, PermissionLevel>> = new Map();
        const data = JSON.parse(fs.readFileSync("permissions.json", "utf-8")) as any;
        for (const guildId in data) {
            const guildPermissions = new Map();
            for (const { user, level } of data[guildId]) {
                guildPermissions.set(user, level);
            }
            permissions.set(guildId, guildPermissions);
        }
        
        return permissions;
    }

}

export const permissionManager = new PermissionManager();