import { TrackListData, TrackListException, TrackListType } from "../typings";
import { SpotifyTrack } from "./SpotifyTrack";

export class SpotifyTrackList {
    public readonly type: TrackListType;
    public readonly additionalInfo: {
        name: string;
        duration: number;
    } | null;

    public readonly exception: TrackListException | null;

    public readonly tracks: SpotifyTrack[];

    public constructor(data: TrackListData) {
        this.type = data.type;
        this.tracks = data.tracks.map(track => new SpotifyTrack(track));
        this.additionalInfo = ["ALBUM", "PLAYLIST"].includes(this.type) ? data.additionalInfo ?? null : null;
        this.exception = data.exception ?? null;
    }
}
