import { google } from 'googleapis';

const youtube = google.youtube('v3');

/**
 * Extracts the Video ID from a YouTube URL.
 * Supports standard URLs, short URLs, and embed URLs.
 */
export const extractVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
};

/**
 * Fetches video details from YouTube Data API.
 * Requires YOUTUBE_API_KEY in environment variables.
 */
export const getVideoDetails = async (videoId: string) => {
    try {
        if (!process.env.YOUTUBE_API_KEY) {
            throw new Error('YOUTUBE_API_KEY is not defined');
        }

        const response = await youtube.videos.list({
            key: process.env.YOUTUBE_API_KEY,
            part: ['snippet', 'statistics', 'contentDetails'],
            id: [videoId]
        });

        if (!response.data.items || response.data.items.length === 0) {
            throw new Error('Video not found');
        }

        const video = response.data.items[0];

        return {
            title: video.snippet?.title,
            description: video.snippet?.description,
            channelTitle: video.snippet?.channelTitle,
            publishedAt: video.snippet?.publishedAt,
            thumbnails: video.snippet?.thumbnails,
            tags: video.snippet?.tags,
            viewCount: video.statistics?.viewCount,
            likeCount: video.statistics?.likeCount,
            commentCount: video.statistics?.commentCount,
            duration: video.contentDetails?.duration
        };
    } catch (error) {
        console.error('Error fetching YouTube video:', error);
        throw error;
    }
};
