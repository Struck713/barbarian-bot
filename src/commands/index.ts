import Play from "../commands/voice/play";
import Skip from "../commands/voice/skip"
import Queue from "../commands/voice/queue";
import Stop from "../commands/voice/stop";
// import Deploy from "./admin/deploy";
import Status from "./misc/status";
import Meme from "./silly/meme";
import Help from "./misc/help";
import Oobinate from "./silly/oob";
import Perms from "./admin/perms";
import Stats from "./misc/stats";

const commands = [ Help, Play, Skip, Queue, Stop, Meme, Oobinate, Status, Perms, Stats ];
export default commands;