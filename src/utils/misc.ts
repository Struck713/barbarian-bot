import { exec } from "child_process";

export type Pair<K, V> = { key: K, value: V };

export namespace Text {
    
    export const NUMBERS = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣️'];

    export enum HTML_ENTITIES {
        nbsp = ' ',
        cent = '¢',
        pound = '£',
        yen = '¥',
        euro = '€',
        copy = '©',
        reg = '®',
        lt = '<',
        gt = '>',
        quot = '"',
        amp = '&',
        apos = '\''
    };

    export const number = (value: number, singular: string, plural: string = `${singular}s`) => `${value} ${value == 1 ? singular : plural}`;
    
    export const decodeEntities = (str: string) => {
        return str.replace(/\&([^;]+);/g, (entity, entityCode) => {
            var match;
            if (entityCode in HTML_ENTITIES) {
                return HTML_ENTITIES[entityCode as keyof typeof HTML_ENTITIES];
            } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
                return String.fromCharCode(parseInt(match[1], 16));
            } else if (match = entityCode.match(/^#(\d+)$/)) {
                return String.fromCharCode(~~match[1]);
            } else {
                return entity;
            }
        });
    };

}

export namespace Git {
    export const getVersionHash = () => promisifyCommand("git rev-parse --short HEAD") as Promise<string>;

    const promisifyCommand = (command: string) =>
        new Promise((res, rej) => exec(command, (error, out) => error ? rej(error) : res(out.trim())));
}