import { Spotify } from "../structures/Spotify";
import { UnresolvedData } from "../typings";

export class Artist {
    private readonly spotify: Spotify;

    public constructor(spotify: Spotify) {
        this.spotify = spotify;
    }

    public async resolve(Id: string): Promise<UnresolvedData> {
        try {
            const artist = await this.spotify.makeRequest(`/artists/${Id}/top-tracks?market=US`);
            const res = await this.spotify.makeRequest(`/artists/${Id}`);
            if (!artist.tracks) return { tracks: [], name: undefined };

            const tracks = artist.tracks.map((track: any) => this.spotify.buildUnresolved(track));

            return { tracks, name: res.name };
        } catch (error) {
            return { tracks: [], name: undefined };
        }
    }
}
