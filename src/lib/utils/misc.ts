
export type Pair<K, V> = { key: K, value: V };

export namespace Text {
    
    export const NUMBERS = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ];

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