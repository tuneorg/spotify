import { Spotify } from "../structures/Spotify";

export class Playlist {
    private readonly spotify: Spotify;

    public constructor(spotify: Spotify) {
        this.spotify = spotify;
    }

    public async resolve(Id: string): Promise<any> {
        try {
            const playlist = await this.spotify.makeRequest(`/playlist/${Id}`);
            if (!playlist.tracks) return { tracks: [], name: undefined };

            const tracks = playlist.tracks.map((track: any) => this.spotify.buildUnresolved(track));
            let next = playlist.tracks.next;

            /* eslint no-negated-condition: "off" */
            while (next) {
                const nextPage = await this.spotify.makeRequest(next.split("v1")[1] as string);
                tracks.push(...nextPage.items.filter((x: any) => x.track.name).map((item: any) => this.spotify.buildUnresolved(item.track)));
                next = nextPage.next;
            }

            return { tracks, name: playlist.name };
        } catch (error) {
            return { tracks: [], name: undefined };
        }
    }
}
