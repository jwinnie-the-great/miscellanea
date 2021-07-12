import * as Koa from "koa";
// Workaround for TypeScript
import { Context, Middleware as KoaMiddleware } from "koa";

import { Middleware } from "./middleware";

// Convenience re-exports
export { Context };

export class Server {
    private _app: Koa;
    constructor() {
        this._app = new Koa();
    }
    plugin(m: Middleware) {
        this._app.use(ctx => (m.is_applicable(ctx) && m.handle(ctx)));
    }
    raw_plugin(m: KoaMiddleware) {
        this._app.use(m);
    }
    listen(port = 8888) {
        return this._app.listen(port);
    }
}
