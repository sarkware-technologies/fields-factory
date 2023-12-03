import cors from "cors";
import http from "http";
import CacheManager from "./cache-manager.js";
import SocketManager from "./socket-manager.js";
import SessionManager from "./session-manager.js";
import RouteHelper from "./route-helper.js";
import { createProxyMiddleware } from "http-proxy-middleware";

export default class RouterService {
 
    constructor(_express) {

        this.tokenCache = {};
        this.express = _express;
        this.routeHelper = new RouteHelper();

    }

    

}