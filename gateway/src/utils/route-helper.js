import CacheManager from "./cache-manager.js";
import SocketService from "./socket.js";

/**
 *
 * @author  : Sark
 * @version : 1.0.0
 * @description : Helper module for validating incoming request and constructing the target URL for intended services.
 *
 */
export default class RouteHelper {

    constructor() {}

    validateRequest = async (_service, _version, _feature, _req) => {
    
        const userSession = cache.getAuth(_req.headers["user"]);
    
        if (userSession) {

        }

    }

    checkCapability = async (_method, _feature, _roleId) => {

        let caps = CacheManager.getCap(_roleId);



    }

    buildUrl = (_service, _version, _feature, _req) => {

    }

    getUrlPathParts = (_url) => {

        const parsedUrl = new URL(_url);
        const pathname = parsedUrl.pathname;
        const parts = pathname.split("/").filter((part) => part !== "");
    
        if (parts && Array.isArray(parts) && parts.length >= 4) {
          return [parts[1], parts[2], parts[3]];
        }
    
        return [null, null, null];
        
    };

}