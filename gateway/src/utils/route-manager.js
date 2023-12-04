import cors from "cors";
import http from "http";
import CacheManager from "./cache-manager.js";
import SocketManager from "./socket-manager.js";
import SessionManager from "./session-manager.js";
import RouteHelper from "./route-helper.js";
import { createProxyMiddleware } from "http-proxy-middleware";

export default class RouterManager {
 
    constructor(_express) {

        this.tokenCache = {};
        this.express = _express;
        this.routeHelper = new RouteHelper();

    }

    registerRequestHandler = () => {
    
        this.express.use("/system/users/check", async (_req, _res, _next) => {
            
            try {
                createProxyMiddleware({ target: process.env.SYSTEM_SERVER })(_req, _res, _next);
            } catch (_e) {
                _res.status(500).end(_e.message);
            }

        });

        this.express.use("/system/users/secret", async (_req, _res, _next) => {

            try {
                createProxyMiddleware({ target: process.env.SYSTEM_SERVER })(_req, _res, _next);
            } catch (_e) {
                _res.status(500).end(_e.message);
            }

        });

        this.express.use("/system/users/reset", async (_req, _res, _next) => {

            try {
                createProxyMiddleware({ target: process.env.SYSTEM_SERVER })(_req, _res, _next);
            } catch (_e) {
                _res.status(500).end(_e.message);
            }

        });

        this.express.use("/system/users/sign-in", async (_req, _res, _next) => {

            try {
                createProxyMiddleware({
                    target: process.env.SYSTEM_SERVER,
                    onProxyRes: (proxyRes, req, res) => {
                        proxyRes.on("data", (data) => {
                            /* Check whether the attempt is successfull */
                            try {
                                const response = JSON.parse(data.toString("utf-8"));
                                if (response.status) {
                                    const uid = response.payload.user;
                                    delete response.payload.user;                                    
                                    /* Auth is success - Initiate session */
                                    CacheManager.setAuth(uid, response.payload);
                                    /* Initiate session expire timer */
                                    SessionManager.initTimer(uid);
                                } else {
                                    /* Safe to ignore - taken care by client side */
                                }
                            } catch (_e) {
                                console.error(_e);
                            }
                        });
                    },
                })(_req, _res, _next);
            } catch (_e) {
                _res.status(500).end(_e.message);
            }

        });

        this.express.use("/system/users/sign-out", cors());
        this.express.use("/system/users/sign-out", (_req, _res, _next) => {

            if (!_req.query.user) {
                return;
            }

            const userSession = CacheManager.getAuth(_req.query.user);
            if (userSession) {
                /* Remove it from the sesison */
                CacheManager.removeAuth(_req.query.user);
                _res.writeHead(401, { "Content-Type": "text/plain" });
                _res.end("Session invalidated.");                
            }

            return;

        });

        this.express.use("/system", async (_req, _res, _next) => {

            try {

                const user = _req.headers["user"];
                /* validate the request */
                const userSession = CacheManager.getAuth(user);
                
                if (userSession &&
                    userSession.role &&
                    userSession.role.handle === process.env.ROLE_SYSTEM) {

                    createProxyMiddleware({ target: process.env.SYSTEM_SERVER })(_req, _res, _next);

                } else {
                    _res.status(401).end("Unauthorized request, only system user allowed");
                }
            } catch (_e) {
                throw new Error(_e);
            }

        });

        this.express.use("/service", async (_req, _res, _next) => {

        });

    }

}