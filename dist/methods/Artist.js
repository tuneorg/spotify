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
                return { tracks: [], type: "ARTIST", name: undefined };
            const tracks = artist.tracks.map((track) => this.spotify.buildUnresolved(track));
            return { tracks, type: "ARTIST", name: res.name };
        }
        catch (error) {
            return { tracks: [], type: "ARTIST", name: undefined };
        }
    }
}
exports.Artist = Artist;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXJ0aXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21ldGhvZHMvQXJ0aXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLE1BQWEsTUFBTTtJQUdmLFlBQW1CLE9BQWdCO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFTSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQVU7UUFDM0IsSUFBSTtZQUNBLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDckYsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2dCQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDO1lBRTNFLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRXRGLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3JEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQztTQUMxRDtJQUNMLENBQUM7Q0FDSjtBQXBCRCx3QkFvQkMifQ==