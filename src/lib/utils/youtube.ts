import Axios from 'axios';
import { YOUTUBE } from "../../../config.json";
import { Text } from './misc';
import { ytdl } from '../../app';

const YOUTUBE_URL_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
const YOUTUBE_PLAYLIST_QUERY_REGEX = /\?list=(.+)/;

const search = async (query: string): Promise<YoutubeMetadata | undefined> => {
    const res = await Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelType=any&eventType=none&q=${query}&videoType=any&key=${YOUTUBE.KEY}`)
                           .then(res => res.data)
                           .catch(_ => undefined);
    if (!res) return undefined;
    let { id: { videoId } } = res.items[0];
    return getMetadata(createShareUrl(videoId), false);
}

const getPlaylistMetadata = async (url: string): Promise<YoutubeMetadata[] | undefined> => {
    let playlistParse = YOUTUBE_PLAYLIST_QUERY_REGEX.exec(url);
    if (!playlistParse || !playlistParse[1]) return undefined;

    const res = await Axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistParse[1]}&maxResults=15&key=${YOUTUBE.KEY}`)
                           .then(res => res.data)
                           .catch(_ => undefined);
    if (!res) return undefined;
    return await Promise.all(res.items.map((item: any) => getMetadata(createShareUrl(item.contentDetails.videoId), false)));
}
    
/**
 * Get the metadata associated with a YouTube video, using its URL.
 * 
 * @param url The YouTube URL to get metadata for.
 * @param cleanse If this URL is already in the share format, set this to false to skip the cleanse .
 * @returns A YoutubeMetadata object if the URL is valid, otherwise undefined.
 */
const getMetadata = async (url: string, cleanse: boolean = true): Promise<YoutubeMetadata | undefined> => {
    if (cleanse) {
        let capture = YOUTUBE_URL_REGEX.exec(url);
        if (!capture || !capture[6]) return undefined;
        url = createShareUrl(capture[6]);
    }

    let res = await ytdl.getVideoInfo(url).catch(_ => undefined);
    if (res) return new YoutubeMetadata(res.fulltitle, res.channel, url, res.thumbnail, res.duration);
    else return undefined;
}

const isPlaylist = (url: string): boolean => {
    let captures = YOUTUBE_URL_REGEX.exec(url);
    return !!captures && captures[6] === "playlist";
};


const getThumbnailUrl = (id: string): string => `https://i3.ytimg.com/vi/${id}/maxresdefault.jpg`;
const createShareUrl = (id: string): string => `https://youtu.be/${id}`;

export class YoutubeMetadata {
    
    private title: string;
    private author: string;
    private url: string;
    private duration: number;
    private thumbnailUrl: string;
    
    constructor(title: string, 
                author: string, 
                url: string, 
                thumbnailUrl: string,
                duration: number) {
        this.title = Text.decodeEntities(title);
        this.author = Text.decodeEntities(author);
        this.url = url;
        this.duration = duration;
        this.thumbnailUrl = thumbnailUrl;
    }
    
    getTitle(): string {
        return this.title;
    }
    
    getAuthor(): string {
        return this.author;
    }
    
    getUrl(): string {
        return this.url;
    }
    
    getThumbnailUrl(): string {
        return this.thumbnailUrl;
    }

    getDuration(): number {
        return this.duration;
    }
    
}

export default { search, getMetadata, isPlaylist, getPlaylistMetadata, createShareUrl };