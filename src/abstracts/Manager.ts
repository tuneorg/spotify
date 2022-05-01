import { RequestHandler } from "../structures/RequestHandler";
import { SpotifyTrackList } from "../structures/SpotifyTrackList";

export abstract class Manager {
    public constructor(protected readonly request: RequestHandler) {}
    public abstract resolve(id: string): Promise<SpotifyTrackList>;
}
