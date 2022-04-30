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

export class SpotifyClient {
    private album!: Album | null;
    private artist!: Artist | null;
    private track!: Track | null;
    private playlist!: Playlist | null;
    private recommendations!: Recommendations | null;
    private readonly request: RequestHandler;
    private readonly baseURL = "https://api.spotify.com/";
    private readonly regex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(?<TYPE>track|playlist|artist|album)[/:](?<ID>[A-Za-z0-9]+)/;

    public constructor(private readonly options: SpotifyClientOptions) {
        validateClientOptions(options);
        this.request = new RequestHandler(this.baseURL);
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

    public async search(query: string): Promise<SpotifyTrackList | undefined> {
        const [, type, id] = this.regex.exec(query) ?? [];

        switch (type) {
            case "track": {
                return this.track?.resolve(id);
            }
            case "artist": {
                return this.artist?.resolve(id);
            }
            case "album": {
                return this.album?.resolve(id);
            }
            case "playlist": {
                return this.playlist?.resolve(id);
            }
        }
    }

    public async searchRecommendations(options: RecommendationsOptions): Promise<SpotifyTrackList | undefined> {
        const _opts = {};

        for (const [key, value] of Object.entries(options)) {
            if (Array.isArray(value)) _opts[key] = value.join(",");
            _opts[key] = value;
        }

        const searchParams = new URLSearchParams(_opts);
        return this.recommendations?.resolve(searchParams.toString());
    }

    public async renewToken(): Promise<void> {
        const result = await this.fetchToken();
        if (typeof result !== "object") throw new RangeError("SpotifyClient#fetchToken: An error occured while fetching the bearer token");
        const { access_token, expires_in } = result;
        this.request.applyToken(`Bearer ${access_token}`);
        this.track = new Track(this.request);
        this.album = new Album(this.request);
        this.playlist = new Playlist(this.request);
        this.artist = new Artist(this.request);
        this.recommendations = new Recommendations(this.request);
        setTimeout(_ => this.renewToken(), (expires_in * 1000) - 100);
    }
}
