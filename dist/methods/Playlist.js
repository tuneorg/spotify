"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
class Playlist {
    constructor(spotify) {
        this.spotify = spotify;
    }
    async resolve(Id) {
        try {
            const playlist = await this.spotify.makeRequest(`/playlists/${Id}`);
            if (!playlist.tracks)
                return { tracks: [], name: undefined };
            const tracks = playlist.tracks.items.filter((x) => x.track.name).map((item) => this.spotify.buildUnresolved(item.track));
            let next = playlist.tracks.next;
            while (next) {
                const nextPage = await this.spotify.makeRequest(next.split("v1")[1]);
                tracks.push(...nextPage.items.filter((x) => x.track.name).map((item) => this.spotify.buildUnresolved(item.track)));
                next = nextPage.next;
            }
            return { tracks, name: playlist.name };
        }
        catch (error) {
            return { tracks: [], name: undefined };
        }
    }
}
exports.Playlist = Playlist;
