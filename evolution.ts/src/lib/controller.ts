
import { FastifyRequest, FastifyReply } from "fastify";

export type action = (request: FastifyRequest<any>, reply: FastifyReply<any>) => any;