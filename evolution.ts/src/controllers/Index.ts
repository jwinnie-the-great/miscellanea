
import { action } from "../lib/controller";

export const index: action = (_, reply) => {
    reply.status(200).header("Content-Type", "text/html").send("Hello, World!");
}