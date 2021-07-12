
import { Middleware } from "./middleware";
import { Options } from "lru-cache";

export interface Settings
{
    production: boolean
    log: {
        debug: boolean
    }
    server: {
        port: number
        middleware: {
            chain: Array<Middleware>
            error_chain: Array<Middleware>
            notfound_chain: Array<Middleware>
            success_chain: Array<Middleware>
        }
    }
    cache?: Options
}