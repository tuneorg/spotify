import { track } from "../constants/endpoints";
import { RequestHandler } from "../structures/RequestHandler";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APITrack } from "../typings";

export class Track {
    public constructor(private readonly request: RequestHandler) {}

    public async resolve(trackId: string): Promise<SpotifyTrackList> {
        try {
            const response = await this.request.make<APITrack>(track(trackId), "GET");

            return new SpotifyTrackList({
                type: "TRACK",
                tracks: [response]
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
