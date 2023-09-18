import { join } from "path";

export namespace Entities {

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

export namespace Time {

    export const PROGRESS_UNFILLED = ":white_large_square:";
    export const PROGRESS_FILLED = ":yellow_square:";

    export const decode = (str: string): number => {
        let [minutes, seconds] = str.split(":");
        return (parseInt(minutes) * 60000) + (parseInt(seconds) * 1000);
    }

    export const format = (ms?: number, type: "seconds" | "milliseconds" = "milliseconds"): string => {
        if (!ms) return "0:00";
        if (type === "milliseconds") ms = Math.floor(ms / 1000);
        
        let minutes = Math.floor(ms / 60);
        let seconds = (ms % 60).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    }

    export const progress = (segments: number, min?: number, max?: number) => {
        if (!min || !max) return Array(segments).fill(PROGRESS_UNFILLED),join(""); 
        
        let percent = Math.floor(((min / max) * segments));
        let overall = segments - percent;
        return Array(percent).fill(PROGRESS_FILLED).concat(Array(overall).fill(PROGRESS_UNFILLED)).join("");
    }

}