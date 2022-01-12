"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = void 0;
class Album {
    constructor(spotify) {
        this.spotify = spotify;
    }
    async resolve(Id) {
        try {
            const album = await this.spotify.makeRequest(`/albums/${Id}`);
            if (!album.tracks)
                return { tracks: [], name: undefined };
            const tracks = album.tracks.items.map((track) => this.spotify.buildUnresolved(track));
            return { tracks, name: album.name };
        }
        catch (error) {
            return { tracks: [], name: undefined };
        }
    }
}
exports.Album = Album;
