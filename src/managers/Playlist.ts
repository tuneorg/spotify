import { playlist, playlistTracks } from "../constants/endpoints";
import { RequestHandler } from "../structures/RequestHandler";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APIPlaylist } from "../typings";

export class Playlist {
    public constructor(private readonly request: RequestHandler) {}

    public async resolve(playlistId: string): Promise<SpotifyTrackList> {
        try {
            const request = await this.request.make<APIPlaylist>(playlist(playlistId), "GET");
            const completeTracks = [];
            let nextURL: string | null;

            if (request.tracks.items.length) {
                const tracks = await this.request.make<APIPlaylist["tracks"]>(`${playlistTracks(playlistId)}`, "GET");
                nextURL = tracks.next;
                completeTracks.push(...tracks.items);
                if (tracks.next) {
                    while (nextURL) {
                        const nextTracks = await this.request.make<APIPlaylist["tracks"]>(nextURL);
                        nextURL = nextTracks.next;
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        if (nextTracks.items) {
                            completeTracks.push(...nextTracks.items);
                        } else { tracks.next = null; }
                    }
                }
            }

            console.log(completeTracks[0]);

            return new SpotifyTrackList({
                type: "PLAYLIST",
                // @ts-expect-error ignore
                tracks: completeTracks.filter(i => i.track).map(i => i.track),
                additionalInfo: {
                    name: request.name,
                    // @ts-expect-error ignore
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    duration: completeTracks.filter(i => i.track).map(i => i.track).reduce((a, b) => a + b.duration_ms, 0),
                    coverPicture: request.images[0].url
                }
            });
        } catch (e: any) {
            console.log(e);
            return new SpotifyTrackList({
                type: "PLAYLIST",
                tracks: [],
                exception: {
                    type: "SEVERE",
                    message: e.message
                }
            });
        }
    }
}
