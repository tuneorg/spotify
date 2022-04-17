/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { SpotifyClientOptions } from "../typings";

export function validateClientOptions(options: SpotifyClientOptions): void {
    if (!options || typeof options !== "object") throw new TypeError("SpotifyClient#options: No options provided");
    if (typeof options.clientId !== "string") throw new TypeError("SpotifyClient#options: Provided clientId is not valid");
    if (typeof options.clientSecret !== "string") throw new TypeError("SpotifyClient#options: Provided clientSecret is not valid");
}
