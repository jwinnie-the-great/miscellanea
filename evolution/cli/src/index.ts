
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

import program from "commander";
import * as fastify from "fastify";
import glob from "glob";
import * as R from "ramda";
import * as ts from "typescript";

const server = fastify.default({
    logger: {
        prettyPrint: true,
    },
});

const getPath = R.pipe(path.join, path.resolve) as (...paths: string[]) => string;
const readTextFrom = R.pipe(getPath, R.curry(R.flip(fs.readFileSync))("utf8")) as (...paths: string[]) => string;
const addRoutes = (dir: string) => R.forEachObjIndexed((val, route) => {
    R.forEachObjIndexed((handler, method) => {
        const [controller, action] = R.split("#", handler);
        const controllerPath = getPath(dir, "src", "controllers", R.concat(controller, ".js"));
        const handlerFunc: fastify.RequestHandler<any, any> = require(controllerPath)[action];
        server.route({
            handler: handlerFunc,
            method: method as fastify.HTTPMethod,
            url: route as string,
        });
    }, val);
});
const parent = (filename: string) => path.basename(path.dirname(filename));
const transpileTs = (filename: string) => {
    const {outputText, diagnostics} = ts.transpileModule(readTextFrom(filename), {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            strict: true,
        },
    });
    console.error(diagnostics); // tslint:disable-line
    fs.writeFileSync(getPath(parent(filename), ".build", filename.), outputText);
};

program
    .command("serve")
    .alias("s")
    .description("Run the development server")
    .option("-d --dir <dir>", "Root directory of the project", ".")
    .action(async (opts: {
        dir: string,
    }) => {
        const routes: {
            [routes: string]: {
                [methods: string]: string,
            },
        } = JSON.parse(readTextFrom(opts.dir, "routes.json"));
        addRoutes(opts.dir)(routes);
        server.listen(8888);
    });

program.parse(process.argv);
