import Axios from 'axios';
import { YOUTUBE } from "../../../config.json";
import { Entities, Time } from './misc';
import { ytdl } from '../../app';

const YOUTUBE_SHORTENED_URL = "https://youtu.be/";
const YOUTUBE_URL_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;

const search = async (query: string): Promise<YoutubeMetadata | undefined> => {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelType=any&eventType=none&q=${query}&videoType=any&key=${YOUTUBE.KEY}`
    const res = await Axios.get(url).then(res => res.data).catch(_ => undefined);
    if (!res) return undefined;

    let { id: { videoId } } = res.items[0];
    return getMetadata(createShareUrl(videoId));
 }
    
const getVideoIdFromUrl = (url: string) => {
    let capture = YOUTUBE_URL_REGEX.exec(url);
    return capture ? capture[6] : "";
}

const getMetadata = async (url: string): Promise<YoutubeMetadata | undefined> => {
    let res = await ytdl.getVideoInfo(url).catch(_ => undefined);
    if (res) return new YoutubeMetadata(res.fulltitle, res.channel, createShareUrl(res.display_id), res.thumbnail, res.duration);
    else return undefined;
}

const getThumbnailUrl = (id: string): string => `https://i3.ytimg.com/vi/${id}/maxresdefault.jpg`;
const createShareUrl = (id: string): string => `${YOUTUBE_SHORTENED_URL}${id}`;

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
        this.title = Entities.decodeEntities(title);
        this.author = Entities.decodeEntities(author);
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

export default { search, getVideoIdFromUrl, getMetadata, createShareUrl };