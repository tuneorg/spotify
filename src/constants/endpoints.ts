export const track = (trackId: string): string => `/v1/tracks/${trackId}`;
export const album = (albumId: string): string => `/v1/albums/${albumId}`;
export const playlist = (playlistId: string): string => `/v1/playlists/${playlistId}`;
export const artist = (artistId: string): string => `/v1/artists/${artistId}`;
export const albumTracks = (albumId: string, limit: number): string => `/v1/albums/${albumId}/tracks?limit=${limit}`;
export const artistTracks = (artistId: string, market = "US"): string => `/v1/artists/${artistId}/top-tracks?market=${market}`;
export const playlistTracks = (playlistId: string): string => `/v1/playlists/${playlistId}/tracks`;
