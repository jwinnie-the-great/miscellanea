
import { HTTPMethod } from "fastify";
import { readFileSync } from "fs";
import { join } from "path";
import _ from "lodash";

import { server } from "../lib/server";

const routes = JSON.parse(readFileSync("config/routes.json", "utf8"));
for (let [route, val] of Object.entries(routes)) {
    for(let [method, handler] of Object.entries(val)) {
        const [controller, action] = _.split(handler, "#");
        const handler_func = require(join("../controllers/", controller + ".js"))[action];
        server.route({
            method: method as HTTPMethod,
            url: route,
            handler: handler_func
        });
    }
}

server.listen(8888);