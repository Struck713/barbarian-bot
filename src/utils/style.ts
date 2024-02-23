import { Colors } from "discord.js";

import { style } from "../../config.json";

export namespace Color {
    export const DEFAULT = style.colors.primary;
    export const ERROR = style.colors.error;
}

export const NAME = style.name;
export const ENGINE_VERSION = style.engine.name;
export const VERSION = style.engine.version;
export const PROFILE_URL = style.engine.image