import { RequestHandler } from "./RequestHandler";
import { AccessTokenResponse, RecommendationsOptions, SpotifyClientOptions } from "../typings";
import { validateClientOptions } from "../validators/clientValidator";
import { request } from "undici";
import { Album } from "../managers/Album";
import { Artist } from "../managers/Artist";
import { Track } from "../managers/Track";
import { Playlist } from "../managers/Playlist";
import { SpotifyTrackList } from "./SpotifyTrackList";
import { Recommendations } from "../managers/Recommendations";
import { URLSearchParams } from "node:url";
import { Manager } from "../abstracts/Manager";

export class SpotifyClient {
    private readonly baseURL = "https://api.spotify.com/";
    private readonly request = new RequestHandler(this.baseURL);
    private readonly managers: Record<string, any> = {
        album: new Album(this.request),
        artist: new Artist(this.request),
        playlist: new Playlist(this.request),
        track: new Track(this.request),
        recommendations: new Recommendations(this.request)
    };

    private readonly regex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(?<TYPE>track|playlist|artist|album)[/:](?<ID>[A-Za-z0-9]+)/;

    public constructor(private readonly options: SpotifyClientOptions) {
        validateClientOptions(options);
    }

    public isValidURL(url: string): boolean {
        return this.regex.test(url);
    }

    public fetchToken(): Promise<AccessTokenResponse> {
        return new Promise((resolve, reject) => {
            request("https://accounts.spotify.com/api/token?grant_type=client_credentials", {
                headers: {
                    authorization: `Basic ${Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString("base64")}`,
                    "content-type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
                .then(result => resolve(result.body.json()))
                .catch(error => reject(error));
        });
    }

    public search(query: string): Promise<SpotifyTrackList> {
        const [, type, id] = this.regex.exec(query) ?? [];
        const manager: Manager | undefined = this.managers[type];
        if (!manager) throw Error(`Invalid Spotify URL. No parser found for resource type: ${type}`);
        return manager.resolve(id);
    }

    public searchRecommendations(options: RecommendationsOptions): Promise<SpotifyTrackList> {
        const _opts: Record<string, any> = {};

        for (const [key, value] of Object.entries(options)) {
            if (Array.isArray(value)) _opts[key] = value.join(",");
            else _opts[key] = value;
        }

        const searchParams = new URLSearchParams(_opts);
        return this.managers.recommendations.resolve(searchParams.toString());
    }

    public async renewToken(): Promise<void> {
        const result = await this.fetchToken();
        if (typeof result !== "object") throw new RangeError("SpotifyClient#fetchToken: An error occured while fetching the bearer token");
        const { access_token, expires_in } = result;
        this.request.applyToken(`Bearer ${access_token}`);
        setTimeout(() => this.renewToken(), (expires_in * 1000) - 100);
    }
}
