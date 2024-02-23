namespace Time {

    export const Units = {
        year: { label: 'y', divisor: 31104000000 },
        month: { label: 'mo', divisor: 2592000000 },
        day: { label: 'd', divisor: 86400000 },
        hour: { label: 'h', divisor: 3600000 },
        minute: { label: 'm', divisor: 60000 },
        second: { label: 's', divisor: 1000 },
    };

    export const PROGRESS_UNFILLED = ":white_large_square:";
    export const PROGRESS_FILLED = ":yellow_square:";

    export const decode = (str: string): number => {
        let [minutes, seconds] = str.split(":");
        return (parseInt(minutes) * 60000) + (parseInt(seconds) * 1000);
    };

    export const format = (ms?: number, type: "seconds" | "milliseconds" = "milliseconds"): string => {
        if (!ms) return "0:00";
        if (type === "milliseconds") ms = Math.floor(ms / 1000);

        let minutes = Math.floor(ms / 60);
        let seconds = (ms % 60).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    export const progress = (segments: number, min?: number, max?: number) => {
        if (!min || !max) return Array(segments).fill(PROGRESS_UNFILLED).join("");

        let percent = Math.floor(((min / max) * segments));
        let overall = segments - percent;
        return Array(percent).fill(PROGRESS_FILLED).concat(Array(overall).fill(PROGRESS_UNFILLED)).join("");
    };

    export const latestTime = (time: number) => {
        let result = '';

        for (const unit of Object.values(Time.Units)) {
            const value = Math.floor(time / unit.divisor);
            if (value !== 0) {
                result += `${value}${unit.label}, `;
                time %= unit.divisor;
            }
        }

        result = result.substring(0, Math.max(0, result.length - 2));
        if (result === '') return '0s';

        return result;
    };

}

export default Time;