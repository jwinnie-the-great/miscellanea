
import { Context } from "./server";
import { Middleware } from "./middleware";

export type RoutingTable = { [key: string]: (ctx: Context) => void };

export class RoutingMiddleware implements Middleware {
    tmp_matched!: (ctx: Context) => void;
    constructor(public table: RoutingTable) {}
    is_applicable(ctx: Context) {
        this.tmp_matched = this.table[ctx.path];
        return this.tmp_matched !== undefined;
    }
    handle(ctx: Context) {
        this.tmp_matched(ctx);
    }
}

