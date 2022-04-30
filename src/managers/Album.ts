import { album, albumTracks } from "../constants/endpoints";
import { RequestHandler } from "../structures/RequestHandler";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APIAlbum } from "../typings";

export class Album {
    public constructor(private readonly request: RequestHandler) {}

    public async resolve(albumId: string): Promise<SpotifyTrackList> {
        try {
            const request = await this.request.make<APIAlbum>(album(albumId), "GET");
            const completeTracks = [];
            let nextURL: string | null;

            if (request.tracks.items.length) {
                const tracks = await this.request.make<APIAlbum["tracks"]>(`${albumTracks(albumId, 50)}`, "GET");
                nextURL = tracks.next;
                completeTracks.push(...tracks.items);
                if (tracks.next) {
                    while (tracks.next) {
                        const nextTracks = await this.request.make<APIAlbum["tracks"]>(nextURL!);
                        nextURL = nextTracks.next;
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        if (nextTracks.items) {
                            completeTracks.push(...nextTracks.items);
                        } else { tracks.next = null; }
                    }
                }
            }

            return new SpotifyTrackList({
                type: "ALBUM",
                tracks: completeTracks,
                additionalInfo: {
                    name: request.name,
                    duration: completeTracks.reduce((a, b) => a + b.duration_ms, 0),
                    coverPicture: request.images[0].url
                }
            });
        } catch (e: any) {
            return new SpotifyTrackList({
                type: "ALBUM",
                tracks: [],
                exception: {
                    type: "SEVERE",
                    message: e.message
                }
            });
        }
    }
}
