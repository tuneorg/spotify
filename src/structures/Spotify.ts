/* eslint-disable @typescript-eslint/naming-convention */
import fetch from "petitio";
import { HTTPMethod } from "petitio/dist/lib/PetitioRequest";
import { Album } from "../methods/Album";
import { Artist } from "../methods/Artist";
import { Playlist } from "../methods/Playlist";
import { Track } from "../methods/Track";
import { Collection } from "@tuneorg/collection";
import { SpotifyOptions, UnresolvedData, UnresolvedTrack } from "../typings";

export class Spotify {
    private readonly options: SpotifyOptions;
    private token: string | null;
    private readonly baseURL = "https://api.spotify.com/v1";
    private readonly regex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|artist|album)[\/:]([A-Za-z0-9]+)/;

    private readonly methods: Record<string, Album | Track | Playlist | Artist | undefined> = {
        track: new Track(this),
        artist: new Artist(this),
        album: new Album(this),
        playlist: new Playlist(this)
    };

    private readonly cache: Collection<string, UnresolvedData> | null;
    private readonly cacheLifetime: number;

    public constructor(options: SpotifyOptions) {
        this.options = options;
        this.cacheLifetime = options.cacheLifeTime ?? 30 * 60 * 1000;
        this.cache = options.cacheResults ? new Collection() : null;
        this.token = null;
        options.cacheResults ? this.initSweeper() : null;
    }

    /** Determine the URL is a valid Spotify URL or not */
    public isValidURL(url: string): boolean {
        return this.regex.test(url);
    }

    public buildUnresolved(spotifyTrack: any): UnresolvedTrack {
        return {
            artists: Array.isArray(spotifyTrack.artists) ? spotifyTrack.artists.map((x: any) => x.name).join(", ") : spotifyTrack.artists,
            duration: spotifyTrack.duration_ms,
            isResolved: false,
            originURL: spotifyTrack.external_urls.spotify,
            title: spotifyTrack.name
        };
    }

    public async search(url: string): Promise<UnresolvedData | null> {
        const [, type, id] = this.regex.exec(url) ?? [];

        if (this.options.cacheResults) {
            const existing = this.cache?.get(id);
            if (existing) return existing;
        }

        const method = this.methods[type];
        if (method) {
            const resolve = await method.resolve(id).catch(() => null);
            if (resolve?.tracks.length && this.options.cacheResults) this.cache?.set(id, resolve);
            return resolve;
        }

        return null;
    }

    public async makeRequest(endpoint: string, method?: HTTPMethod): Promise<any> {
        if (!this.token) throw new Error("Spotify#renewToken must be called before making the requests");
        endpoint = endpoint.replace(/^\//gm, "");

        const request = fetch(`${this.baseURL}/${endpoint}`, method)
            .header("Authorization", this.token);

        return request.json();
    }

    public async renewToken(): Promise<void> {
        const request = fetch("https://accounts.spotify.com/api/token?grant_type=client_credentials", "POST")
            .header("Authorization", `Basic ${Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString("base64")}`)
            .header("Content-Type", "application/x-www-form-urlencoded");

        const { access_token, expires_in } = await request.json();

        this.token = `Bearer ${access_token}`;

        setInterval(() => this.renewToken(), expires_in * 1000);
    }

    private initSweeper(): void {
        setInterval(() => this.cache?.clear(), this.cacheLifetime);
    }
}
