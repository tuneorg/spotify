import { Spotify } from "../structures/Spotify";
import { UnresolvedData } from "../typings";

export class Track {
    private readonly spotify: Spotify;

    public constructor(spotify: Spotify) {
        this.spotify = spotify;
    }

    public async resolve(Id: string): Promise<UnresolvedData> {
        try {
            const res = await this.spotify.makeRequest(`/tracks/${Id}`);
            if (!res) return { tracks: [], type: "TRACK" };

            const track = this.spotify.buildUnresolved(res);

            return { tracks: [track], type: "TRACK" };
        } catch (error) {
            return { tracks: [], type: "TRACK" };
        }
    }
}
