/* eslint-disable @typescript-eslint/naming-convention */
import fetch from "petitio";
import { HTTPMethod } from "petitio/dist/lib/PetitioRequest";
import { SpotifyOptions } from "../typings";

export class Spotify {
    private readonly options: SpotifyOptions;
    private token: string | null;
    private readonly baseURL = "https://api.spotify.com/v1";

    public constructor(options: SpotifyOptions) {
        this.options = options;
        this.token = null;
    }

    private async makeRequest(endpoint: string, method?: HTTPMethod): Promise<any> {
        if (!this.token) throw new Error("Spotify#renewToken must be called before making the requests");
        endpoint = endpoint.replace(/^\//gm, "");

        const request = fetch(`${this.baseURL}/${endpoint}`, method)
            .header("Authorization", this.token);

        return request.json();
    }

    private async renewToken(): Promise<void> {
        const request = fetch("https://accounts.spotify.com/api/token?grant_type=client_credentials", "POST")
            .header("Authorization", `Basic ${Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString("base64")}`)
            .header("Content-Type", "application/x-www-form-urlencoded");

        const { access_token, expires_in } = await request.json();

        this.token = `Bearer ${access_token}`;

        setInterval(() => this.renewToken(), expires_in * 1000);
    }
}
