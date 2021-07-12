
import * as http from "http";
import { Settings } from "./settings";
import { Request, Response } from "./middleware";

const write_response =
    (response: Response,
    response_raw: http.ServerResponse) =>
{
    for (let [key, value] of response.headers)
    {
        response_raw.setHeader(key, value);
    }
    response_raw.write(response.body);
    response_raw.statusCode = response.status_code;
    response_raw.end();
}

const handle_success =
    (config: Settings,
    request: Request,
    response: Response) =>
{
    let working_response = response;
    let handled = false;
    for (let middleware of config.server.middleware.notfound_chain)
    {
        if (middleware.is_applicable(request, response))
        {
            if (config.log.debug)
            {
                console.log(`before NOTFOUND ${middleware}: ` + JSON.stringify(working_response));
            }
            let response_candidate = middleware.handle(
                request,
                working_response);
            if (response_candidate instanceof Response)
            {
                working_response = response_candidate;
                handled = true;
            }
            if (config.log.debug)
            {
                console.log(`after NOTFOUND ${middleware}: ` + JSON.stringify(working_response))
            }
        }
    }
    if (handled) {
        return working_response;
    }
    if (response.body === undefined) {
        console.error("warning: unhandled 404");
        return response.send("text/html", "<h1>404: Not Found</h1>", 404);
    }
    return response;
}

const handle_notfound =
    (config: Settings,
    request: Request,
    response: Response) =>
{
    let working_response = response;
    let handled = false;
    for (let middleware of config.server.middleware.notfound_chain)
    {
        if (middleware.is_applicable(request, response))
        {
            if (config.log.debug)
            {
                console.log(`before NOTFOUND ${middleware}: ` + JSON.stringify(working_response));
            }
            let response_candidate = middleware.handle(
                request,
                working_response);
            if (response_candidate instanceof Response)
            {
                working_response = response_candidate;
                handled = true;
            }
            if (config.log.debug)
            {
                console.log(`after NOTFOUND ${middleware}: ` + JSON.stringify(working_response))
            }
        }
    }
    if (handled) {
        return working_response;
    }
    return response;
}

const handle_error =
    (config: Settings,
    request: Request,
    response: Response): Response =>
{
    let working_response = response;
    let handled = false;
    for (let middleware of config.server.middleware.error_chain)
    {
        if (middleware.is_applicable(request, response))
        {
            if (config.log.debug)
            {
                console.log(`before ERROR ${middleware.constructor.name}: ` + JSON.stringify(working_response));
            }
            let response_candidate = middleware.handle(
                request,
                working_response);
            if (response_candidate instanceof Response)
            {
                working_response = response_candidate;
                handled = true;
            }
            if (config.log.debug)
            {
                console.log(`after ERROR ${middleware.constructor.name}: ` + JSON.stringify(working_response))
            }
        }
    }
    if (handled) {
        return working_response;
    }
    if (response.body === undefined) {
        console.error("warn: unhandled 500");
        return response.send("text/html", "<h1>500: Server Error</h1>", 500);
    }
    return response;
}

// Currying
const handle = (config: Settings) =>
    (request_raw: http.IncomingMessage,
        response_raw: http.ServerResponse) => 
    {
        const request: Request = {
            headers: request_raw.headers,
            http_version: request_raw.httpVersion,
            method: request_raw.method,
            url: request_raw.url
        };
        let response = new Response();
        // Go through the middleware chain
        for (let middleware of config.server.middleware.chain)
        {
            if (middleware.is_applicable(request, response))
            {
                if (config.log.debug)
                {
                    console.log(`before ${middleware.constructor.name}: ` + JSON.stringify(response));
                }
                let response_candidate = middleware.handle(
                    request,
                    response);
                if (response_candidate instanceof Response)
                {
                    response = response_candidate;
                }
                if (config.log.debug)
                {
                    console.log(`after ${middleware.constructor.name}: ` + JSON.stringify(response))
                }
            }
        }
        // Finish up the response
        switch (response.status_code)
        {
            case 200:
                response = handle_success(config, request, response);
                break;
            case 500:
                response = handle_error(config, request, response);
                break;
            case 404:
                response = handle_notfound(config, request, response);
                break;
        }
        write_response(response, response_raw);
    }

export class Server {
    constructor(public config: Settings)
    {}
    listen()
    {
        http.createServer(handle(this.config)).listen(this.config.server.port);
    }
}
