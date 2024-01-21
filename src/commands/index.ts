import { Play } from "../commands/voice/play";
import { Skip } from "../commands/voice/skip"
import { Queue } from "../commands/voice/queue";
import { Stop } from "../commands/voice/stop";
import { Deploy } from "../commands/deploy";
import { Status } from "../commands/status";
import { Meme } from "./meme";
import { Help } from "./help";
import { Poll } from "./poll";
import { Oobinate } from "./oob";

export const COMMANDS = [ Help, Play, Skip, Queue, Stop, Meme, Oobinate, Poll, Status, Deploy ]; 