import { TrackListData, TrackListException, TrackListType } from "../typings";
import { SpotifyTrack } from "./SpotifyTrack";

export class SpotifyTrackList {
    public readonly type: TrackListType;
    public readonly playlistInfo?: {
        name: string;
        duration: number;
    };

    public readonly exception?: TrackListException;

    public readonly tracks: SpotifyTrack[] | [];

    public constructor(data: TrackListData) {
        this.type = data.type;
        this.tracks = data.tracks.map(track => new SpotifyTrack(track));
        this.playlistInfo = this.type === "PLAYLIST" ? data.playlistInfo : undefined;
        this.exception = data.exception ?? undefined;
    }
}
