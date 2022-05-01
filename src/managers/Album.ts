import { Manager } from "../abstracts/Manager";
import { album } from "../constants/endpoints";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APIAlbum } from "../typings";

export class Album extends Manager {
    public async resolve(albumId: string): Promise<SpotifyTrackList> {
        try {
            const response = await this.request.make<APIAlbum>(album(albumId), "GET");
            const completeTracks = [];

            const tracks = response.tracks;
            completeTracks.push(...tracks.items);
            let nextURL: string | null = tracks.next;
            while (nextURL) {
                const nextTracks = await this.request.make<APIAlbum["tracks"]>(nextURL);
                completeTracks.push(...nextTracks.items);
                nextURL = nextTracks.next;
            }

            return new SpotifyTrackList({
                type: "ALBUM",
                tracks: completeTracks,
                additionalInfo: {
                    name: response.name,
                    duration: completeTracks.reduce((a, b) => a + b.duration_ms, 0),
                    coverPicture: response.images[0].url
                }
            });
        } catch (e: any) {
            return new SpotifyTrackList({
                type: "NO_MATCHES",
                tracks: [],
                exception: {
                    type: "SEVERE",
                    message: e.message
                }
            });
        }
    }
}
