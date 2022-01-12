import { Spotify } from "../structures/Spotify";

export class Album {
    private readonly spotify: Spotify;

    public constructor(spotify: Spotify) {
        this.spotify = spotify;
    }

    public async resolve(Id: string): Promise<any> {
        try {
            const album = await this.spotify.makeRequest(`/albums/${Id}`);
            if (!album.tracks) return { tracks: [], name: undefined };

            const tracks = album.tracks.items.map((track: any) => this.spotify.buildUnresolved(track));

            return { tracks, name: album.name };
        } catch (error) {
            return { tracks: [], name: undefined };
        }
    }
}
