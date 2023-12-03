import dotenv from "dotenv";
dotenv.config();

import express, { Router } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import RouterService from "./route-manager.js";
import SocketManager from "./utils/socket-manager.js";
import CacheManager from "./utils/cache-manager.js";
import SessionManager from "./utils/session-manager.js";

class GatewayServer {
 
    constructor() {

        /* Load the express */
        this.server = express();
        this.setupMiddlewares();
  
        this.router = new RouterService(this.server);
        this.router.initRequestHandler();

    }
  
    setupMiddlewares = async () => {

        this.server.use(cors());
        
        this.server.use(
            rateLimit({
                windowMs: 1 * 60 * 1000,
                max: process.env.API_LIMIT,
                standardHeaders: true,
                legacyHeaders: false,
            })
        );

        this.server.use(async (_req, _res, _next) => {

            /* Auth exception for system level endpoints */
            if (
                _req.path === "/system/users/check" ||
                _req.path === "/system/users/secret" ||
                _req.path === "/system/users/reset" ||
                _req.path === "/system/users/sign-in" ||
                _req.path === "/system/users/sign-out" ) {
                _next();
                return;
            }

            /* All remaining request has to have auth header, otherwise consider unauthorized */
            if (_req.headers["Authorization"] && _req.headers["user"]) {

                const user = _req.headers["user"];
                const token = _req.headers["Authorization"].split(" ")[1];
                /* validate the request */
                const userSession = CacheManager.getAuth(user);

                if (userSession && userSession.token == token) {
                    /* Reset token timer */
                    SessionManager.resetTimer(user);
                    _next();
                } else {
                    _res.status(401).end("Unauthorized request");
                }

            } else {
                _res.status(401).end("Unauthorized request");
            }            

        });

        /* Global exception handler */
        this.server.use((_err, _req, _res, _next) => {
        
            if (!_err) {
                return _next();
            }
  
            _res.status(500);
            _res.setHeader("content-type", "text/plain");
            _res.send("Internal server error");

        });
  
        process.on("uncaughtException", (err) => {
            console.error("Uncaught exception:", err);
        });

    }

    listen() {
        this.server.listen(process.env.PORT);
        SocketManager.init();
    }

}

/* Kick start the gateway server */
const gateway = new GatewayServer();
gateway.listen();