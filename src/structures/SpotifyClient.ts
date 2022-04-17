import { RequestHandler } from "./RequestHandler";
import { AccessTokenResponse, SpotifyClientOptions } from "../typings";
import { validateClientOptions } from "../validators/clientValidator";
import { request } from "undici";

export class SpotifyClient {
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

    public async renewToken(): Promise<void> {
        const result = await this.fetchToken();
        if (typeof result !== "object") throw new RangeError("SpotifyClient#fetchToken: An error occured while fetching the bearer token");
        const { access_token, expires_in } = result;
        this.request.applyToken(`Bearer ${access_token}`);
        setTimeout(_ => this.renewToken(), (expires_in * 1000) - 100);
    }
}
