
import { action } from "../lib/controller";
import { renderTemplate } from "../lib/view";

export const hello: action = (req, reply) => {
    renderTemplate(reply, "Hello#hello");
}