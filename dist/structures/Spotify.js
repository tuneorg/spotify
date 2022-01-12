"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spotify = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/naming-convention */
const petitio_1 = (0, tslib_1.__importDefault)(require("petitio"));
const Album_1 = require("../methods/Album");
const Artist_1 = require("../methods/Artist");
const Playlist_1 = require("../methods/Playlist");
const Track_1 = require("../methods/Track");
class Spotify {
    constructor(options) {
        this.baseURL = "https://api.spotify.com/v1";
        this.regex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|artist|album)[\/:]([A-Za-z0-9]+)/;
        this.methods = {
            track: new Track_1.Track(this),
            artist: new Artist_1.Artist(this),
            album: new Album_1.Album(this),
            playlist: new Playlist_1.Playlist(this)
        };
        this.options = options;
        this.token = null;
    }
    /** Determine the URL is a valid Spotify URL or not */
    isValidURL(url) {
        return this.regex.test(url);
    }
    buildUnresolved(spotifyTrack) {
        return {
            artists: spotifyTrack.artists.map((x) => x.name).join(", "),
            duration: spotifyTrack.duration_ms,
            isResolved: false,
            originURL: spotifyTrack.external_urls.spotify,
            title: spotifyTrack.name
        };
    }
    search(url) {
        const [, type, id] = this.regex.exec(url) ?? [];
        const method = this.methods[type];
        if (method) {
            return method.resolve(id);
        }
        return null;
    }
    async makeRequest(endpoint, method) {
        if (!this.token)
            throw new Error("Spotify#renewToken must be called before making the requests");
        endpoint = endpoint.replace(/^\//gm, "");
        const request = (0, petitio_1.default)(`${this.baseURL}/${endpoint}`, method)
            .header("Authorization", this.token);
        return request.json();
    }
    async renewToken() {
        const request = (0, petitio_1.default)("https://accounts.spotify.com/api/token?grant_type=client_credentials", "POST")
            .header("Authorization", `Basic ${Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString("base64")}`)
            .header("Content-Type", "application/x-www-form-urlencoded");
        const { access_token, expires_in } = await request.json();
        this.token = `Bearer ${access_token}`;
        setInterval(() => this.renewToken(), expires_in * 1000);
    }
}
exports.Spotify = Spotify;
