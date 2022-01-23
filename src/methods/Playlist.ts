import { Spotify } from "../structures/Spotify";
import { UnresolvedData } from "../typings";

export class Playlist {
    private readonly spotify: Spotify;

    public constructor(spotify: Spotify) {
        this.spotify = spotify;
    }

    public async resolve(Id: string): Promise<UnresolvedData> {
        try {
            const playlist = await this.spotify.makeRequest(`/playlists/${Id}`);
            if (!playlist.tracks) return { tracks: [], type: "PLAYLIST", name: undefined };

            const tracks = playlist.tracks.items.map((item: any) => this.spotify.buildUnresolved(item.track));
            let next = playlist.tracks.next;

            while (next) {
                const nextPage = await this.spotify.makeRequest(next.split("v1")[1] as string);
                tracks.push(...nextPage.items.map((item: any) => this.spotify.buildUnresolved(item.track)));
                next = nextPage.next;
            }

            return { tracks, type: "PLAYLIST", name: playlist.name };
        } catch (error) {
            return { tracks: [], type: "PLAYLIST", name: undefined };
        }
    }
}
