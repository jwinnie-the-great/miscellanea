import { readdirSync } from "fs";
import { join } from "path";
import { compileFile, compileTemplate } from "pug";
import { FastifyReply } from "fastify";

const templates: { [signature: string]: compileTemplate } = {}

for (let controller of readdirSync("views")) {
    for (let action of readdirSync(join("views", controller))) {
        const compiled = compileFile(join("views", controller, action));
        const signature = [controller, action].join("#").slice(0, -4);
        templates[signature] = compiled;
    }
}

export const renderTemplate = (reply: FastifyReply<any>, name: string, vars?: { [key: string]: any }) => {
    reply.status(200).header("Content-Type", "text/html; charset=utf-8").send(templates[name](vars)); 
}