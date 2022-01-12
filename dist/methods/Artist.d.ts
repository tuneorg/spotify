import { Spotify } from "../structures/Spotify";
import { UnresolvedData } from "../typings";
export declare class Artist {
    private readonly spotify;
    constructor(spotify: Spotify);
    resolve(Id: string): Promise<UnresolvedData>;
}
