
import { Server } from "../server";
import { Middleware, Request, Response, Logger } from "../middleware";
import { Settings } from "../settings";

class Hello extends Middleware {
    is_applicable(request: Request, response: Response) {
        return request.url == "/";
    }
    handle(request: Request, response: Response) {
        return response.send("text/html", "<h1>Hello, World!</h1>", 200);
    }
}

const settings: Settings = {
    production: false,
    log: {
        debug: false
    },
    server: {
        port: 8888,
        middleware: {
            chain: [new Hello()],
            error_chain: [new Logger()],
            notfound_chain: [new Logger()],
            success_chain: [new Logger()]
        }
    }
}

let a = new Server(settings);
a.listen();