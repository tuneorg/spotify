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
                return { tracks: [], type: "TRACK" };
            const track = this.spotify.buildUnresolved(res);
            return { tracks: [track], type: "TRACK" };
        }
        catch (error) {
            return { tracks: [], type: "TRACK" };
        }
    }
}
exports.Track = Track;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWV0aG9kcy9UcmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxNQUFhLEtBQUs7SUFHZCxZQUFtQixPQUFnQjtRQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFVO1FBQzNCLElBQUk7WUFDQSxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsR0FBRztnQkFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFFL0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFaEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztTQUM3QztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO1NBQ3hDO0lBQ0wsQ0FBQztDQUNKO0FBbkJELHNCQW1CQyJ9