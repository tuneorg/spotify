import { Spotify } from "../structures/Spotify";
export declare class Album {
    private readonly spotify;
    constructor(spotify: Spotify);
    resolve(Id: string): Promise<any>;
}
