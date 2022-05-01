import { Manager } from "../abstracts/Manager";
import { playlist } from "../constants/endpoints";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APIPlaylist } from "../typings";

export class Playlist extends Manager {
    public async resolve(playlistId: string): Promise<SpotifyTrackList> {
        try {
            const response = await this.request.make<APIPlaylist>(playlist(playlistId), "GET");
            let completeTracks = [];

            const tracks = response.tracks;
            completeTracks.push(...tracks.items);
            let nextURL: string | null = tracks.next;
            while (nextURL) {
                const nextTracks = await this.request.make<APIPlaylist["tracks"]>(nextURL);
                completeTracks.push(...nextTracks.items);
                nextURL = nextTracks.next;
            }
            completeTracks = completeTracks.filter(i => Boolean(i.track));

            return new SpotifyTrackList({
                type: "PLAYLIST",
                tracks: completeTracks.map(i => i.track!),
                additionalInfo: {
                    name: response.name,
                    duration: completeTracks.reduce((a, b) => a + b.track!.duration_ms, 0),
                    coverPicture: response.images[0]?.url
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
