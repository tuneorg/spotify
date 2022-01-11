"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spotify = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/naming-convention */
const petitio_1 = (0, tslib_1.__importDefault)(require("petitio"));
class Spotify {
    constructor(options) {
        this.baseURL = "https://api.spotify.com/v1";
        this.options = options;
        this.token = null;
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
