import { Manager } from "../abstracts/Manager";
import { recommendations } from "../constants/endpoints";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";
import { APIRecommendations } from "../typings";

export class Recommendations extends Manager {
    public async resolve(query: string): Promise<SpotifyTrackList> {
        try {
            const response = await this.request.make<APIRecommendations>(recommendations(query), "GET");

            return new SpotifyTrackList({
                type: "RECOMMENDATIONS",
                tracks: response.tracks
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
