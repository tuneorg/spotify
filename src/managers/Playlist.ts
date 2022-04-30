import { playlist } from "../constants/endpoints";
import { RequestHandler } from "../structures/RequestHandler";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APIPlaylist } from "../typings";

export class Playlist {
    public constructor(private readonly request: RequestHandler) {}

    public async resolve(playlistId: string): Promise<SpotifyTrackList> {
        try {
            const response = await this.request.make<APIPlaylist>(playlist(playlistId), "GET");
            const completeTracks = [];

            const tracks = response.tracks;
            completeTracks.push(...tracks.items);
            let nextURL: string | null = tracks.next;
            while (nextURL) {
                const nextTracks = await this.request.make<APIPlaylist["tracks"]>(nextURL);
                completeTracks.push(...nextTracks.items);
                nextURL = nextTracks.next;
            }

            return new SpotifyTrackList({
                type: "PLAYLIST",
                tracks: completeTracks.filter(i => Boolean(i.track)).map(i => i.track!),
                additionalInfo: {
                    name: response.name,
                    duration: completeTracks.filter(i => Boolean(i.track)).map(i => i.track!).reduce((a, b) => a + b.duration_ms, 0),
                    coverPicture: response.images[0]?.url
                }
            });
        } catch (e: any) {
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
