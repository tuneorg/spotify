import { Manager } from "../abstracts/Manager";
import { track } from "../constants/endpoints";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APITrack } from "../typings";

export class Track extends Manager {
    public async resolve(trackId: string): Promise<SpotifyTrackList> {
        try {
            const response = await this.request.make<APITrack>(track(trackId), "GET");

            return new SpotifyTrackList({
                type: "TRACK",
                tracks: [response]
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
