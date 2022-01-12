export interface SpotifyOptions {
    clientId: string;
    clientSecret: string;
}
export interface UnresolvedTrack {
    artists: string[];
    title: string;
    duration: number;
    originURL: string;
    isResolved: boolean;
}
