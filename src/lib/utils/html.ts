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