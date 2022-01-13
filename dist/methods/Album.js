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
                return { tracks: [], type: "ALBUM", name: undefined };
            const tracks = album.tracks.items.map((track) => this.spotify.buildUnresolved(track));
            return { tracks, type: "ALBUM", name: album.name };
        }
        catch (error) {
            return { tracks: [], type: "ALBUM", name: undefined };
        }
    }
}
exports.Album = Album;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWxidW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWV0aG9kcy9BbGJ1bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxNQUFhLEtBQUs7SUFHZCxZQUFtQixPQUFnQjtRQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFVO1FBQzNCLElBQUk7WUFDQSxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07Z0JBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7WUFFekUsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRTNGLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3REO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQztTQUN6RDtJQUNMLENBQUM7Q0FDSjtBQW5CRCxzQkFtQkMifQ==