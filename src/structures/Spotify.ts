/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/naming-convention */
import { Pool, Dispatcher, request } from "undici";
import { Album } from "../methods/Album";
import { Artist } from "../methods/Artist";
import { Playlist } from "../methods/Playlist";
import { Track } from "../methods/Track";
import { Collection } from "@tuneorg/collection";
import { RecommendationOptions, SpotifyOptions, UnresolvedData, UnresolvedTrack } from "../typings";
import { URL, URLSearchParams } from "node:url";

export class Spotify {
    private readonly pool: Pool;
    private readonly options: SpotifyOptions;
    private token: string | null;
    private readonly baseURL = "https://api.spotify.com/";
    private readonly regex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(?<TYPE>track|playlist|artist|album)[/:](?<ID>[A-Za-z0-9]+)/;

    private readonly methods: Record<string, Album | Artist | Playlist | Track | undefined> = {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        options.cacheResults ? this.initSweeper() : null;
        this.pool = new Pool(new URL(this.baseURL));
    }

    /** Determine the URL is a valid Spotify URL or not */
    public isValidURL(url: string): boolean {
        return this.regex.test(url);
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

    public async getRecommendations(options: RecommendationOptions): Promise<UnresolvedData> {
        const _opts = {};

        for (const [key, value] of Object.entries(options)) {
            if (Array.isArray(value)) _opts[key] = value.join(",");
            _opts[key] = value;
        }

        const searchParams = new URLSearchParams(_opts);
        try {
            const res = await this.makeRequest(`/recommendations?${searchParams.toString()}`);
            if (!res.tracks) return { name: undefined, tracks: [], type: "RECOMMENDATION" };

            const tracks = res.tracks.map((x: any) => Spotify.buildUnresolved(x));

            return { tracks, type: "RECOMMENDATION", name: "Unknown Title" };
        } catch {
            return { tracks: [], type: "RECOMMENDATION", name: undefined };
        }
    }

    public makeRequest(endpoint: string, method: Dispatcher.HttpMethod = "GET"): Promise<any> {
        if (!this.token) throw new Error("Spotify#renewToken must be called before making the requests");
        endpoint = endpoint.replace(/^\//gm, "");
        return new Promise((resolve, reject) => {
            this.pool.request({
                path: `/v1/${endpoint}`,
                method,
                headers: {
                    authorization: this.token!
                }
            })
                .then(r => resolve(r.body.json()))
                .catch(e => reject(e));
        });
    }

    public async renewToken(): Promise<void> {
        const req = await request("https://accounts.spotify.com/api/token?grant_type=client_credentials", {
            headers: {
                authorization: `Basic ${Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString("base64")}`,
                "content-type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        });

        let json;

        try {
            json = await req.body.json();
        } catch (e) {
            console.error(e);
            console.log(await req.body.text()); // see what the actual response was to learn how to handle it next time
            setTimeout(() => this.renewToken(), 5000); // try again after 5 seconds
            return;
        }

        const { access_token, expires_in } = json;

        this.token = `Bearer ${access_token as string}`;

        setTimeout(() => this.renewToken(), expires_in * 1000);
    }

    private initSweeper(): void {
        setInterval(() => this.cache?.clear(), this.cacheLifetime);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    public static buildUnresolved(spotifyTrack: any): UnresolvedTrack {
        return {
            artists: spotifyTrack.artists.map((x: any) => x.name).join(", "),
            artistsId: spotifyTrack.artists.map((x: any) => x.id),
            duration: spotifyTrack.duration_ms,
            thumbnail: spotifyTrack.album?.images[0]?.url ?? null,
            isResolved: false,
            originURL: spotifyTrack.external_urls.spotify,
            title: spotifyTrack.name,
            isrc: spotifyTrack.external_ids?.isrc ?? null
        };
    }
}
