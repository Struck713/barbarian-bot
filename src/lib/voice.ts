import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { voiceManager, ytdl } from "../app";
import { YoutubeMetadata } from "./utils/youtube";
import { ChildProcessWithoutNullStreams } from "child_process";

export class VoiceManager {

    private connections: VoiceConnection[];

    constructor() {
        this.connections = [];
    }

    join = (channel: VoiceBasedChannel) => {
        let { id, guild } = channel;
        joinVoiceChannel({
            channelId: id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        });

        let connection = new VoiceConnection(guild.id, id);
        this.connections.push(connection);
        return connection;
    }

    get = (guildId: string) => {
        return this.connections.find(connection => connection.guildId == guildId);
    } 

    destroy = (guildId: string) => {
        let connection = this.get(guildId);
        if (!connection) return;

        let index = this.connections.indexOf(connection);
        if (index == -1) return;
        this.connections.splice(index, 1);
    }

}

export class VoiceConnection {

    audioPlayer: AudioPlayer;
    
    guildId: string;
    channelId: string;

    playing?: YoutubeMetadata;
    resource?: AudioResource;
    queue: YoutubeMetadata[];

    private process?: ChildProcessWithoutNullStreams; 
    private timeout?: NodeJS.Timeout;

    constructor(guildId: string, channelId: string) {
        this.guildId = guildId;
        this.channelId = channelId;
        this.audioPlayer = new AudioPlayer();
        this.queue = [];

        this.audioPlayer = createAudioPlayer();
        this.audioPlayer.on(AudioPlayerStatus.Playing, () => console.log(`[GUILD ${this.guildId}] [VC ${this.channelId}] PLAYING - ${this.playing?.getUrl()}: ${this.playing?.getTitle()} by ${this.playing?.getAuthor()}`))
        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            console.log(`[GUILD ${this.guildId}] [VC ${this.channelId}] SONG FINISHED - Changing to next song in queue`)
            this.next()
        });

        let voiceConnection = this.get();
        if (voiceConnection) voiceConnection.subscribe(this.audioPlayer);
        else console.error(`[GUILD ${this.guildId}] [VC ${this.channelId}] FAILED - Could not initialize voice connection.`);
    }

    get = () => getVoiceConnection(this.guildId);
    
    play = (...metadata: YoutubeMetadata[]) => {
        this.queue.push(...metadata);
        if (!this.playing) this.next();
    };

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
        
        console.log(`[GUILD ${this.guildId}] [VC ${this.channelId}] DISCONNECTED - Disconnected from voice (probably due to inactivity)`)
        
        if (this.process) this.process.kill();
        this.process = undefined;

        this.audioPlayer.stop();
        
        voiceConnection.disconnect();
        voiceConnection.destroy();

        this.playing = undefined;
        this.queue = [];

        if (this.timeout) clearInterval(this.timeout);
        voiceManager.destroy(this.guildId);
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