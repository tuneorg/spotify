import { Spotify } from "../structures/Spotify";
export declare class Artist {
    private readonly spotify;
    constructor(spotify: Spotify);
    resolve(Id: string): Promise<any>;
}
