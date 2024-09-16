import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { ytdl } from "../app";
import { SongMetadata } from "../utils/youtube";
import { ChildProcessWithoutNullStreams } from "child_process";
import { db } from "./database";

import { youtube } from "../../config.json"

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

    play = (user_id: string, metadata: SongMetadata) => {
        this.queue.push(metadata);
        db.insertInto("voice")
            .values({
                guild_id: this.guildId,
                user_id,
                search: metadata.search,
                video_url: metadata.url,
                video_name: metadata.title
            })
            .execute();
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
        const process = ytdl.exec(
            [
                "--cookies", youtube.cookies_path,
                "-o",
                "-",
                url,
                "-f",
                "bestaudio[ext=m4a],bestaudio[ext=webm]",
            ]
        );

        process.on('error', (e) => console.log(e));

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

        destroyVoiceFromGuildId(this.guildId);
    }

    next = () => {

        // const playbackDuration = this.resource?.playbackDuration ?? 0;
        // TODO: track if song was skipped!

        this.playing = this.queue.shift();
        if (!this.playing) {
            this.disconnect();
            return;
        }

        this.load(this.playing.url);
    }

}