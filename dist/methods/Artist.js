"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artist = void 0;
class Artist {
    constructor(spotify) {
        this.spotify = spotify;
    }
    async resolve(Id) {
        try {
            const artist = await this.spotify.makeRequest(`/artists/${Id}/top-tracks?market=US`);
            const res = await this.spotify.makeRequest(`/artists/${Id}`);
            if (!artist.tracks)
                return { tracks: [], name: undefined };
            const tracks = artist.tracks.map((track) => this.spotify.buildUnresolved(track));
            return { tracks, name: res.name };
        }
        catch (error) {
            return { tracks: [], name: undefined };
        }
    }
}
exports.Artist = Artist;
