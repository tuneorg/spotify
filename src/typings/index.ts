/* eslint-disable @typescript-eslint/naming-convention */

export type TrackListType = "ALBUM" | "ARTIST" | "NO_MATCHES" | "PLAYLIST" | "RECOMMENDATIONS" | "TRACK";

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
    tracks: APITrack[];
    additionalInfo?: {
        name: string;
        duration: number;
        coverPicture?: string;
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
        images: APIImage[];
    };
}

export interface APIAlbum {
    id: string;
    name: string;
    tracks: {
        items: APITrack[];
        next: string | null;
    };
    images: APIImage[];
}

export interface APIPlaylist {
    id: string;
    name: string;
    tracks: {
        items: { track?: APITrack }[];
        next: string | null;
    };
    images: APIImage[];
}

export interface APIImage {
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

export interface APIArtist {
    id: string;
    name: string;
    images: APIImage[];
}

export interface APIArtistTracks {
    tracks: APITrack[];
}

export interface RecommendationsOptions {
    seed_artists: string[];
    seed_tracks: string[];
    seed_genres: string[];
    limit: number;
}

export interface APIRecommendations {
    seeds: object[];
    tracks: APITrack[];
}
