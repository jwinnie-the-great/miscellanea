import axios from "axios";

import { Server, Context, Routing, LoggerMiddleware } from "../main";

const root = "http://localhost:8888/"
let listening: any;

beforeEach(() => {
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

    listening = s.listen();
});

test("routing", async () => {
    const hello = await axios(root + "hello");
    expect(hello.data).toBe("Hello, World!");
    expect(hello.status).toBe(200);
    const goodbye = await axios(root + "goodbye");
    expect(goodbye.status).toBe(200);
    expect(goodbye.data).toBe("Goodbye, World!");
    listening.close();
});

afterEach(() => {
    listening.close();
})