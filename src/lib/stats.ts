
import fs from "fs";

export enum Stats {
    SONGS_PLAYED = "songsPlayed",
    SECONDS_PLAYED = "secondsPlayed",
}

class StatsManager {

    private stats: Map<Stats, number>;

    constructor() {
        this.stats = new Map();
        this.load();
    }

    save = () => {
        let output: any = {};
        this.stats.forEach((value, key) => output[key] = value);
        fs.writeFileSync("stats.json", JSON.stringify(output));
    }

    set = (key: Stats, value: number) => this.stats.set(key, value);
    inc = (key: Stats, value: number = 1) => this.stats.set(key, this.get(key) + value);
    get = (key: Stats) => this.stats.get(key) ?? 0;

    private load = () => {
        if (!fs.existsSync("stats.json")) {
            fs.writeFileSync("stats.json", JSON.stringify({}));
            return;
        }

        const data = JSON.parse(fs.readFileSync("stats.json", "utf-8"));
        for (const entry in Object.entries(data)) {
            this.stats.set(entry[0] as Stats, Number(entry[1]));
        }
        return;
    }

}

export const statsManager = new StatsManager();