import { Spotify } from "../structures/Spotify";
import { UnresolvedData } from "../typings";

export class Album {
    private readonly spotify: Spotify;

    public constructor(spotify: Spotify) {
        this.spotify = spotify;
    }

    public async resolve(Id: string): Promise<UnresolvedData> {
        try {
            const album = await this.spotify.makeRequest(`/albums/${Id}`);
            if (!album.tracks) return { tracks: [], type: "ALBUM", name: undefined };

            const tracks = album.tracks.items.map((track: any) => this.spotify.buildUnresolved(track));

            return { tracks, type: "ALBUM", name: album.name };
        } catch (error) {
            return { tracks: [], type: "ALBUM", name: undefined };
        }
    }
}
