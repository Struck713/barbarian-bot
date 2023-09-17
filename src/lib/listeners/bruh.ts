import { client, stateManager } from "../../app";
import { BRUH } from "../../../config.json";

export class BruhListener {

    private thread?: NodeJS.Timer;

    constructor() {
        this.thread = setInterval(() => {
            let guild = client.guilds.resolve(BRUH.GUILD);
            if (!guild) return;
            
            let channel = guild.channels.resolve(BRUH.VOICE);
            if (!channel) return;
            channel.edit({ name: `Bruh Count: ${stateManager.bruhCount}`, reason: "New bruh added" });
        }, 5 * 60 * 1000); // 5 minutes
    }


}