import { track } from "../constants/endpoints";
import { RequestHandler } from "../structures/RequestHandler";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APITrack } from "../typings";

export class Track {
    public constructor(private readonly request: RequestHandler) {}

    public async resolve(trackId: string): Promise<SpotifyTrackList> {
        try {
            const request = await this.request.make<APITrack>(track(trackId), "GET");

            return new SpotifyTrackList({
                type: "TRACK",
                tracks: [request]
            });
        } catch (e: any) {
            return new SpotifyTrackList({
                type: "TRACK",
                tracks: [],
                exception: {
                    type: "SEVERE",
                    message: e.message
                }
            });
        }
    }
}
