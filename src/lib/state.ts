import fs from "fs";

interface State {
    bruhCount: number;
}

export class StateManager {

    bruhCount: number = 0;

    constructor() {
        this.load();
    }

    load = () => {
        if (!fs.existsSync("state.lock")) this.save();

        let { bruhCount } = JSON.parse(fs.readFileSync("state.lock", "utf-8")) as State;
        this.bruhCount = bruhCount;
    }

    save = () => {
        fs.writeFileSync("state.lock", JSON.stringify({
            bruhCount: this.bruhCount
        }));
    }


}