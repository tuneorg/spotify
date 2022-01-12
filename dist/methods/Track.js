"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
class Track {
    constructor(spotify) {
        this.spotify = spotify;
    }
    async resolve(Id) {
        try {
            const res = await this.spotify.makeRequest(`/tracks/${Id}`);
            if (!res)
                return { tracks: [] };
            const track = this.spotify.buildUnresolved(res);
            return { tracks: [track] };
        }
        catch (error) {
            return { tracks: [] };
        }
    }
}
exports.Track = Track;
