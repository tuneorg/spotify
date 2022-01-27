export interface SpotifyOptions {
    clientId: string;
    clientSecret: string;
    cacheResults: boolean;
    cacheLifeTime?: number;
}

export interface UnresolvedTrack {
    artists: string;
    title: string;
    duration: number;
    originURL: string;
    isResolved: boolean;
}

export interface UnresolvedData {
    tracks: UnresolvedTrack[];
    type: "ALBUM" | "ARTIST" | "PLAYLIST" | "TRACK";
    name?: string | undefined;
}
