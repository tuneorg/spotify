import { Pool, Dispatcher } from "undici";
import { URL } from "node:url";

export class RequestHandler {
    private readonly pool: Pool;
    private token: string | null = null;

    public constructor(public readonly baseURL: string) {
        this.pool = new Pool(new URL(this.baseURL));
    }

    public applyToken(token: string): void {
        this.token = token;
    }

    public make<T>(endpoint: string, method: Dispatcher.HttpMethod = "GET"): Promise<T> {
        if (typeof this.token !== "string") throw new TypeError("No bearer token found, halting the requet");
        return new Promise((resolve, reject) => {
            this.pool.request({
                path: endpoint,
                method,
                headers: {
                    authorization: this.token!
                }
            })
                .then(result => resolve(result.body.json()))
                .catch(error => reject(error));
        });
    }
}
