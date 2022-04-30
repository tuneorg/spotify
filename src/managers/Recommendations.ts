import { recommendations } from "../constants/endpoints";
import { RequestHandler } from "../structures/RequestHandler";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APIRecommendations } from "../typings";

export class Recommendations {
    public constructor(private readonly request: RequestHandler) {}

    public async resolve(query: string): Promise<SpotifyTrackList> {
        try {
            const response = await this.request.make<APIRecommendations>(recommendations(query), "GET");

            return new SpotifyTrackList({
                type: "RECOMMENDATION",
                tracks: response.tracks
            });
        } catch (e: any) {
            return new SpotifyTrackList({
                type: "RECOMMENDATION",
                tracks: [],
                exception: {
                    type: "SEVERE",
                    message: e.message
                }
            });
        }
    }
}
