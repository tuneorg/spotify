import { Manager } from "../abstracts/Manager";
import { artist, artistTracks } from "../constants/endpoints";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APIArtist, APIArtistTracks } from "../typings";

export class Artist extends Manager {
    public async resolve(artistId: string): Promise<SpotifyTrackList> {
        try {
            const response = await this.request.make<APIArtist>(artist(artistId), "GET");

            const topTracks = await this.request.make<APIArtistTracks>(artistTracks(artistId), "GET");

            return new SpotifyTrackList({
                type: "ALBUM",
                tracks: topTracks.tracks,
                additionalInfo: {
                    name: response.name,
                    duration: topTracks.tracks.reduce((a, b) => a + b.duration_ms, 0),
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
