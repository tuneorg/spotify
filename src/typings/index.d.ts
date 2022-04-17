/* eslint-disable @typescript-eslint/naming-convention */
export interface SpotifyClientOptions {
    clientId: string;
    clientSecret: string;
}

export interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
}
