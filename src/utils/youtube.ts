import Axios from 'axios';
import { youtube } from "../../config.json";
import { Text } from './misc';
import { ytdl } from '../app';

const YOUTUBE_URL_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
// const YOUTUBE_PLAYLIST_QUERY_REGEX = /\?list=(.+)/;

const search = async (query: string): Promise<SongMetadata | undefined> => {
    const res = await Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelType=any&eventType=none&q=${query}&type=video&key=${youtube.api_key}`)
                           .then(res => res.data)
                           .catch(_ => undefined);
    if (!res?.items[0]) return undefined;

    const result = res.items[0];
    if (!result.id.videoId) return undefined;

    const videoId = result.id.videoId;
    // const url = createShareUrl(videoId);
    // return new SongMetadata(query, result.snippet.title, result.snippet.channelTitle, url, getThumbnailUrl(videoId), 100);
    return getMetadata(query, createShareUrl(videoId), false)
}

// const getPlaylistMetadata = async (url: string): Promise<SongMetadata[] | undefined> => {
//     let playlistParse = YOUTUBE_PLAYLIST_QUERY_REGEX.exec(url);
//     if (!playlistParse || !playlistParse[1]) return undefined;

//     const res = await Axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistParse[1]}&maxResults=15&key=${youtube.api_key}`)
//                            .then(res => res.data)
//                            .catch(_ => undefined);
//     if (!res) return undefined;
//     return await Promise.all(res.items.map((item: any) => getMetadata(createShareUrl(item.contentDetails.videoId), false)));
// }
    
/**
 * Get the metadata associated with a YouTube video, using its URL.
 * 
 * @param url The YouTube URL to get metadata for.
 * @param cleanse If this URL is already in the share format, set this to false to skip the cleanse .
 * @returns A YoutubeMetadata object if the URL is valid, otherwise undefined.
 */
const getMetadata = async (search: string, url: string, cleanse: boolean = true): Promise<SongMetadata | undefined> => {
    if (cleanse) {
        let capture = YOUTUBE_URL_REGEX.exec(url);
        if (!capture || !capture[6]) return undefined;
        url = createShareUrl(capture[6]);
    }

    let res = await ytdl.getVideoInfo([ url, "--cookies", youtube.cookies_path ]).catch(_ => undefined);
    if (res) return new SongMetadata(search, res.fulltitle, res.channel, url, res.thumbnail, res.duration);
    else return undefined;
}

const isPlaylist = (url: string): boolean => {
    let captures = YOUTUBE_URL_REGEX.exec(url);
    return !!captures && captures[6] === "playlist";
};


const getThumbnailUrl = (id: string): string => `https://i3.ytimg.com/vi/${id}/maxresdefault.jpg`;
const createShareUrl = (id: string): string => `https://youtu.be/${id}`;

export class SongMetadata {
    
    search: string;
    title: string;
    author: string;
    url: string;
    duration: number;
    thumbnail_url: string;
    
    constructor(search: string,
                title: string, 
                author: string, 
                url: string, 
                thumbnailUrl: string,
                duration: number) {
        this.search = search;
        this.title = Text.decodeEntities(title);
        this.author = Text.decodeEntities(author);
        this.url = url;
        this.duration = duration;
        this.thumbnail_url = thumbnailUrl;
    }
    
}

export default { search, getMetadata, getThumbnailUrl, isPlaylist, createShareUrl };