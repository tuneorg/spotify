import { HTTPMethod } from "petitio/dist/lib/PetitioRequest";
import { SpotifyOptions, UnresolvedTrack } from "../typings";
export declare class Spotify {
    private readonly options;
    private token;
    private readonly baseURL;
    private readonly regex;
    private readonly methods;
    constructor(options: SpotifyOptions);
    /** Determine the URL is a valid Spotify URL or not */
    isValidURL(url: string): boolean;
    buildUnresolved(spotifyTrack: any): UnresolvedTrack;
    search(url: string): any;
    makeRequest(endpoint: string, method?: HTTPMethod): Promise<any>;
    renewToken(): Promise<void>;
}
