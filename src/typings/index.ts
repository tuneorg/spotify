/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
export interface SpotifyOptions {
    clientId: string;
    clientSecret: string;
    cacheResults?: boolean;
    cacheLifeTime?: number;
}

export interface UnresolvedTrack {
    artists: string;
    artistsId: string[];
    title: string;
    duration: number;
    thumbnail: string | null;
    originURL: string;
    isResolved: false;
    isrc: string | null;
}

export interface UnresolvedData {
    tracks: UnresolvedTrack[];
    type: "ALBUM" | "ARTIST" | "PLAYLIST" | "RECOMMENDATION" | "TRACK";
    name?: string | undefined;
}

export interface RecommendationOptions {
    seed_artists?: string[];
    seed_tracks?: string[];
    seed_genres?: string[];
    limit?: number;
    [key: string]: any;
}
