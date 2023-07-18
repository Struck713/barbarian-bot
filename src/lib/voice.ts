import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { createReadStream, createWriteStream } from "fs";
import { YoutubeMetadata } from "./utils/youtube";
import ytdl from "ytdl-core";

//const ytdl = new YTDLPWrap('C:/Users/Noah/Programming/JavaScript/BarbarianBot_v2/binaries/yt-dlp.exe');

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

}

export class VoiceConnection {

    audioPlayer: AudioPlayer;
    
    guildId: string;
    channelId: string;

    playing?: YoutubeMetadata;
    queue: YoutubeMetadata[];

    private resource?: AudioResource;

    constructor(guildId: string, channelId: string) {
        this.guildId = guildId;
        this.channelId = channelId;
        this.audioPlayer = new AudioPlayer();
        this.queue = [];

        this.audioPlayer = createAudioPlayer();
        this.audioPlayer.on(AudioPlayerStatus.Playing, () => console.log("Switched to playing.."))
        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            console.log("Idling, playing next song..");
            this.next()
        });

        let voiceConnection = this.get();
        if (voiceConnection) voiceConnection.subscribe(this.audioPlayer);
        else console.error("FAILED TO INIT VOICE CONNECTION SUBSCRIPTION!");
    }

    get = () => getVoiceConnection(this.guildId);
    
    play = (metadata: YoutubeMetadata) => {
        this.queue.push(metadata);
        if (!this.playing) this.next();
    };

    skip = () => {
        this.next();
        return this.playing!;
    };

    load = async (url: string) => {
        let voiceConnection = this.get();
        if (!voiceConnection) return false;

        const stream = ytdl(url, { filter: "audioonly" });
        this.resource = createAudioResource(stream);
        this.audioPlayer.play(this.resource);
        
        return true;
    }
    
    disconnect = () => {
        let voiceConnection = this.get();
        if (!voiceConnection) return { type: VoiceConnectionStatusType.FAIL, message: "Not connected to a voice channel!"};
        
        this.audioPlayer.stop();
        voiceConnection.disconnect();

        return { type: VoiceConnectionStatusType.SUCCESS, message: "Disconnected from voice."};
    }

    next = () => {
        this.playing = this.queue.shift();
        if (!this.playing) return { type: VoiceConnectionStatusType.FAIL, message: "There isn't a next song in the queue." };

        this.load(this.playing.getUrl());
        // this.paused = false;
        // if (this.disconnectId) clearTimeout(this.disconnectId);

        return { type: VoiceConnectionStatusType.SUCCESS, message: `Playing \`${this.playing.getTitle()} - ${this.playing.getAuthor()}\`` };
    }

}

export interface VoiceConnectionStatus {
    type: VoiceConnectionStatusType; 
    message: string;
    metadata?: YoutubeMetadata;
    time?: string;
}

export enum VoiceConnectionStatusType {

    SUCCESS = 1,
    FAIL = 0

}