import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { ytdl } from "../app";
import { SongMetadata } from "../utils/youtube";
import { ChildProcessWithoutNullStreams } from "child_process";

const connections: VoiceConnection[] = [];

export const initializeVoice = (channel: VoiceBasedChannel) => {
    let { id, guild } = channel;
    joinVoiceChannel({
        channelId: id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator
    });

    let connection = new VoiceConnection(guild.id, id);
    connections.push(connection);
    return connection;
}

export const getVoiceFromGuildId = (guildId: string) => {
    return connections.find(connection => connection.guildId == guildId);
} 

export const destroyVoiceFromGuildId = (guildId: string) => {
    let connection = getVoiceFromGuildId(guildId);
    if (!connection) return;

    let index = connections.indexOf(connection);
    if (index == -1) return;
    connections.splice(index, 1);
}

export class VoiceConnection {

    audioPlayer: AudioPlayer;
    
    guildId: string;
    channelId: string;

    playing?: SongMetadata;
    resource?: AudioResource;
    queue: SongMetadata[];

    private process?: ChildProcessWithoutNullStreams; 
    private timeout?: NodeJS.Timeout;

    constructor(guildId: string, channelId: string) {
        this.guildId = guildId;
        this.channelId = channelId;
        this.audioPlayer = new AudioPlayer();
        this.queue = [];

        this.audioPlayer = createAudioPlayer();
        this.audioPlayer.on(AudioPlayerStatus.Idle, () => this.next());

        let voiceConnection = this.get();
        if (voiceConnection) voiceConnection.subscribe(this.audioPlayer);
    }

    get = () => getVoiceConnection(this.guildId);
    
    play = (...metadata: SongMetadata[]) => {
        this.queue.push(...metadata);
        if (!this.playing) this.next();
    }

    skip = () => {
        this.next();
        return this.playing!;
    };

    load = async (url: string) => {
        let voiceConnection = this.get();
        if (!voiceConnection) return false;

        if (this.process) this.process.kill();
        const process = await ytdl.exec(
            [
                "-o",
                "-",
                url,
                "-f",
                "bestaudio[ext=m4a],bestaudio[ext=webm]"
            ]
        );

        if (process.ytDlpProcess) {
            this.process = process.ytDlpProcess;
            this.resource = createAudioResource(this.process.stdout);
            this.audioPlayer.play(this.resource);
        }

        return true;
    }
    
    disconnect = () => {
        let voiceConnection = this.get();
        if (!voiceConnection) return;
        
        if (this.process) this.process.kill();
        this.process = undefined;

        this.audioPlayer.stop();
        
        voiceConnection.disconnect();
        voiceConnection.destroy();

        this.playing = undefined;
        this.queue = [];

        if (this.timeout) clearInterval(this.timeout);
        destroyVoiceFromGuildId(this.guildId);
    }

    next = () => {
        this.playing = this.queue.shift();
        if (!this.playing) {
            this.timeout = setInterval(() => this.disconnect(), 1000 * 60 * 5);
            return;
        }

        this.load(this.playing.getUrl());
        if (this.timeout) clearTimeout(this.timeout);
    }

}