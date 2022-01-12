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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BvdGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL1Nwb3RpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseURBQXlEO0FBQ3pELHNEQUE0QjtBQUU1Qiw0Q0FBeUM7QUFDekMsOENBQTJDO0FBQzNDLGtEQUErQztBQUMvQyw0Q0FBeUM7QUFHekMsTUFBYSxPQUFPO0lBYWhCLFlBQW1CLE9BQXVCO1FBVnpCLFlBQU8sR0FBRyw0QkFBNEIsQ0FBQztRQUN2QyxVQUFLLEdBQUcsb0dBQW9HLENBQUM7UUFFN0csWUFBTyxHQUFrRTtZQUN0RixLQUFLLEVBQUUsSUFBSSxhQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3RCLE1BQU0sRUFBRSxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUM7WUFDeEIsS0FBSyxFQUFFLElBQUksYUFBSyxDQUFDLElBQUksQ0FBQztZQUN0QixRQUFRLEVBQUUsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQztTQUMvQixDQUFDO1FBR0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELHNEQUFzRDtJQUMvQyxVQUFVLENBQUMsR0FBVztRQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxlQUFlLENBQUMsWUFBaUI7UUFDcEMsT0FBTztZQUNILE9BQU8sRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEUsUUFBUSxFQUFFLFlBQVksQ0FBQyxXQUFXO1lBQ2xDLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFNBQVMsRUFBRSxZQUFZLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDN0MsS0FBSyxFQUFFLFlBQVksQ0FBQyxJQUFJO1NBQzNCLENBQUM7SUFDTixDQUFDO0lBRU0sTUFBTSxDQUFDLEdBQVc7UUFDckIsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLElBQUksTUFBTSxFQUFFO1lBQ1IsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBZ0IsRUFBRSxNQUFtQjtRQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7UUFDakcsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXpDLE1BQU0sT0FBTyxHQUFHLElBQUEsaUJBQUssRUFBQyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksUUFBUSxFQUFFLEVBQUUsTUFBTSxDQUFDO2FBQ3ZELE1BQU0sQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpDLE9BQU8sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTSxLQUFLLENBQUMsVUFBVTtRQUNuQixNQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFLLEVBQUMsc0VBQXNFLEVBQUUsTUFBTSxDQUFDO2FBQ2hHLE1BQU0sQ0FBQyxlQUFlLEVBQUUsU0FBUyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2FBQzNILE1BQU0sQ0FBQyxjQUFjLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztRQUVqRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTFELElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxZQUFZLEVBQUUsQ0FBQztRQUV0QyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM1RCxDQUFDO0NBQ0o7QUFqRUQsMEJBaUVDIn0=