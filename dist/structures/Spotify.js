"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spotify = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const petitio_1 = __importDefault(require("petitio"));
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
            artists: Array.isArray(spotifyTrack.artists) ? spotifyTrack.artists.map((x) => x.name).join(", ") : spotifyTrack.artists,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BvdGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL1Nwb3RpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseURBQXlEO0FBQ3pELHNEQUE0QjtBQUU1Qiw0Q0FBeUM7QUFDekMsOENBQTJDO0FBQzNDLGtEQUErQztBQUMvQyw0Q0FBeUM7QUFHekMsTUFBYSxPQUFPO0lBYWhCLFlBQW1CLE9BQXVCO1FBVnpCLFlBQU8sR0FBRyw0QkFBNEIsQ0FBQztRQUN2QyxVQUFLLEdBQUcsb0dBQW9HLENBQUM7UUFFN0csWUFBTyxHQUFrRTtZQUN0RixLQUFLLEVBQUUsSUFBSSxhQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3RCLE1BQU0sRUFBRSxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUM7WUFDeEIsS0FBSyxFQUFFLElBQUksYUFBSyxDQUFDLElBQUksQ0FBQztZQUN0QixRQUFRLEVBQUUsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQztTQUMvQixDQUFDO1FBR0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELHNEQUFzRDtJQUMvQyxVQUFVLENBQUMsR0FBVztRQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxlQUFlLENBQUMsWUFBaUI7UUFDcEMsT0FBTztZQUNILE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPO1lBQzdILFFBQVEsRUFBRSxZQUFZLENBQUMsV0FBVztZQUNsQyxVQUFVLEVBQUUsS0FBSztZQUNqQixTQUFTLEVBQUUsWUFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQzdDLEtBQUssRUFBRSxZQUFZLENBQUMsSUFBSTtTQUMzQixDQUFDO0lBQ04sQ0FBQztJQUVNLE1BQU0sQ0FBQyxHQUFXO1FBQ3JCLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFaEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLE1BQU0sRUFBRTtZQUNSLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM3QjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQWdCLEVBQUUsTUFBbUI7UUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1FBQ2pHLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV6QyxNQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFLLEVBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLFFBQVEsRUFBRSxFQUFFLE1BQU0sQ0FBQzthQUN2RCxNQUFNLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRU0sS0FBSyxDQUFDLFVBQVU7UUFDbkIsTUFBTSxPQUFPLEdBQUcsSUFBQSxpQkFBSyxFQUFDLHNFQUFzRSxFQUFFLE1BQU0sQ0FBQzthQUNoRyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQzthQUMzSCxNQUFNLENBQUMsY0FBYyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7UUFFakUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUUxRCxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsWUFBWSxFQUFFLENBQUM7UUFFdEMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDNUQsQ0FBQztDQUNKO0FBakVELDBCQWlFQyJ9