
import { Context, Server } from "./server";

export interface Middleware {
    is_applicable(ctx: Context): boolean;
    handle(ctx: Context): void;
}

export namespace Middleware {
    // Convenience decorators
    export function mount(s: Server) {
        return function(c: any) {
            s.plugin(new c());
            return c;
        };
    }
}