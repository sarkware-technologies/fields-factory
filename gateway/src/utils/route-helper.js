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

}