import { APITrack, TrackArtist } from "../typings";

export class SpotifyTrack {
    public readonly title: string;
    public readonly originURL: string;
    public readonly duration: number;
    public readonly artists: TrackArtist[];
    public readonly isrc?: string;
    public readonly thumbnail?: string;

    public constructor(apiTrack: APITrack) {
        this.title = apiTrack.name;
        this.originURL = apiTrack.external_urls.spotify;
        this.duration = apiTrack.duration_ms;
        // TODO: Fix the output
        this.artists = apiTrack.artists;
        this.isrc = apiTrack.external_ids?.isrc ?? undefined;
        this.thumbnail = apiTrack.album?.images[0].url ?? undefined;
    }
}
