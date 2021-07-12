
import { Map } from "immutable";

export interface Request
{
    readonly headers: {
        [key: string]: string | Array<string> | undefined
    }
    readonly http_version: string
    readonly method: string | undefined
    readonly url: string | undefined
}

export class Response
{
    constructor(
        public readonly headers: Map<string, string> = Map(),
        public readonly body: any = undefined,
        public readonly status_code: number = 404)
    {}
    send(content_type: string, body: string, code: number)
    {
        return new Response(
            this.headers.set("content-type", content_type),
            body,
            code);
    }
    set_header(key: string, value: string)
    {
        return new Response(this.headers.set(key, value));
    }
}

export abstract class Middleware
{
    is_applicable(
        request: Request,
        response: Response): boolean
    {
        return false;
    }
    abstract handle(
        request: Request,
        response: Response): Response | Promise<void>;
}

export class Logger extends Middleware {
    is_applicable(request: Request, response: Response) {
        return true;
    }
    async handle(request: Request, response: Response) {
        console.log(`${request.method} ${request.url} => ${response.status_code}`);
    }
}