/* eslint-disable @typescript-eslint/naming-convention */

export type TrackListType = "ALBUM" | "ARTIST" | "PLAYLIST" | "TRACK";

export interface SpotifyClientOptions {
    clientId: string;
    clientSecret: string;
}

export interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
}

export interface TrackArtist {
    name: string;
    id: string;
}

export interface TrackListData {
    tracks: APITrack[] | [];
    playlistInfo?: {
        name: string;
        duration: number;
    };
    exception?: TrackListException;
    type: TrackListType;
}

export interface TrackListException {
    type: "FRIENDLY" | "SEVERE";
    message?: string;
}

/**
 * Raw API Typings
 */

export interface APITrack {
    type: "track";
    name: string;
    external_urls: {
        spotify: string;
    };
    external_ids?: {
        isrc?: string;
    };
    duration_ms: number;
    artists: APITrackArtist[];
    album?: {
        images: APITrackImage[];
    };
}

export interface APITrackImage {
    height: number;
    width: number;
    url: string;
}

export interface APITrackArtist {
    external_urls: {
        spotify: string;
    };
    name: string;
    id: string;
    type: "artist";
}
