import Axios from 'axios';
import { YOUTUBE } from "../../../config.json";

const YOUTUBE_SHORTENED_URL = "https://youtu.be/";
const YOUTUBE_URL_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;

const search = async (query: string): Promise<YoutubeMetadata | undefined> => {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelType=any&eventType=none&q=${query}&videoType=any&key=${YOUTUBE.KEY}`
    const res = await Axios.get(url).then(res => res.data).catch(_ => undefined);
    if (!res) return undefined;

    let videoData = res.items[0];
    return new YoutubeMetadata(
        videoData.snippet.title, 
        videoData.snippet.channelTitle, 
        `${YOUTUBE_SHORTENED_URL}${videoData.id.videoId}`, 
        videoData.snippet.thumbnails.high.url
        );
    }
    
const getVideoIdFromUrl = (url: string) => {
    let capture = YOUTUBE_URL_REGEX.exec(url);
    return capture ? capture[6] : undefined;
}

const getMetadata = async (url: string): Promise<YoutubeMetadata | undefined> => {
    let shortenedUrl = createShareUrl(url);
    const urlMetadata: string = `https://www.youtube.com/oembed?url=${shortenedUrl}&format=json`;
    const urlThumbnail: string = `https://i3.ytimg.com/vi/${getVideoIdFromUrl(url)}/maxresdefault.jpg`;
    const res = await Axios.get(urlMetadata).then(res => res.data).catch(_ => undefined);
    if (res) return new YoutubeMetadata(res.title, res.author_name, shortenedUrl, urlThumbnail);
    else return undefined;
}

const createShareUrl = (url: string): string => {
    return `${YOUTUBE_SHORTENED_URL}${ getVideoIdFromUrl(url) }`;
}

export class YoutubeMetadata {
    
    private title: string;
    private author: string;
    private url: string;
    private thumbnailUrl: string;
    
    constructor(title: string, author: string, url: string, thumbnailUrl: string) {
        this.title = title;
        this.author = author;
        this.url = url;
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
    
}

export default { search, getVideoIdFromUrl, getMetadata, createShareUrl };