
import { Server, Context, Routing, LoggerMiddleware } from "./main";

const s = new Server();

s.plugin(new Routing.RoutingMiddleware({
    "/hello": (ctx: Context) => {
        ctx.body = "Hello, World!";
    },
    "/goodbye": (ctx: Context) => {
        ctx.body = "Goodbye, World!";
    }
}));

s.raw_plugin(LoggerMiddleware());

s.listen();