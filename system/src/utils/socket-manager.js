import {Server} from "socket.io";
import TokenManager from "./token-manager.js";
import ModuleService from "../services/service.js";
import EntityService from "../services/entity.js";
import RoleService from "../services/role.js";
import PartnerService from "../services/partner.js";
import PreferenceService from "../services/preference.js";

/**
 * 
 * @author Sark
 * @version 1.0.0
 * 
 * 
 */
class SystemSocket {

    constructor() {
                
        /* Holds all the client instances */
        this.clients = {};
        /*  */
        this.tokenManager = new TokenManager();
        
        this.socket = null;
        this.io = new Server();
        this.io.listen(3333);

        this.io.on('connection', (_socket) => {
        
            _socket.on("register", (_name) => {

                /* Updated to handle multiple replicas of micro services */
                if (!this.clients[_name]) {
                    this.clients[_name] = {};
                }
                this.clients[_name][_socket.id] = _socket;

            });

            /* Handle default events */
            _socket.on("disconnect", (_data) => this.handleDisconnect(_socket, _data));
            _socket.conn.on("close", (_data) => this.handleClose(_socket, _data));
            _socket.conn.on("connection_error", (_data) => this.handleError(_socket, _data));

            /* Handle authentican events */
            _socket.on("issueToken", (_data) => this.handleIssueTokenRequest(_socket, _data));
            _socket.on("verifyToken", (_data) => this.handleVerifyTokenRequest(_socket, _data));
            
            /* Handle service events */
            _socket.on("routes", (_data) => this.handleServiceRoutesRequest(_socket, _data));
            _socket.on("entities", (_data) => this.handleEntityListRequest(_socket, _data));
            _socket.on("entity", (_data) => this.handleEntityGetRequest(_socket, _data));
            _socket.on("menus", (_data) => this.handleMenusRequest(_socket, _data));
            _socket.on("capabilities", (_data) => this.handleCapabilityRequest(_socket, _data));            
            _socket.on("demand_capabilities", (_data) => this.handleDemandCapabilityRequest(_socket, _data));            
            _socket.on("partner_features", (_data) => this.handlePartnerFeatureRequest(_socket, _data));     
            _socket.on("demand_partner_features", (_data) => this.handleDemandPartnerFeatureRequest(_socket, _data));
            _socket.on("notify_config", (_data) => this.handleNotifyConfigRequest(_socket, _data));     
            _socket.on("demand_service_entity", (_data) => this.handleDemandPartnerFeatureRequest(_socket, _data));
            
        });

    }    

    /**
     * 
     * @param {*} _client 
     * @param {*} _event 
     * @param {*} _data 
     * 
     * Generic method which can push message to any mentioned client
     * 
     */
    notifyClient = (_client, _event, _data) => {

        if (this.clients[_client]) {

            let clientSocket;
            let sKeys = Object.keys(this.clients[_client]);
            for (let i = 0; i < sKeys.length; i++) {
                clientSocket = this.clients[_client][sKeys[i]];
                if (clientSocket) {
                    clientSocket.emit(_event, _data);
                }
            }
        }

    }

    handleServiceRoutesRequest = async (_socket, _data) => { 

        //this.checkGatewaySocket(_socket);

        const moduleService = new ModuleService();
        const routeList = await moduleService.prepareRoutes();
        _socket.emit("routes", routeList);

    }

    pushToGateway = async (_event, _param) => {

        let gatewaySocket;
        let gKeys = Object.keys(this.clients["GATEWAY"]);

        for (let i = 0; i < gKeys.length; i++) {
            gatewaySocket = this.clients["GATEWAY"][gKeys[i]];
            if (gatewaySocket) {
                if (_event === "routes") {
                    this.handleServiceRoutesRequest(gatewaySocket);
                } else if (_event === "capabilities") {
                    this.handleCapabilityRequest(gatewaySocket, _param);
                } else if(_event === "menus") {
                    this.handleMenusRequest(gatewaySocket);
                } else if(_event === "partner_features") {
                    this.handlePartnerFeatureRequest(gatewaySocket, _param);
                }  
            }
        }

    }

    pushToNotify = async (_event, _param) => {
        
        let notifySocket;
        let nKeys = Object.keys(this.clients["NOTIFY"]);

        for (let i = 0; i < nKeys.length; i++) {
            notifySocket = this.clients["NOTIFY"][nKeys[i]];
            if (notifySocket) {
                if (_event === "notify_config") {
                    this.handleNotifyConfigRequest(notifySocket);
                }
            }
        }

    }

    handleEntityListRequest = async (_socket, _data) => {
        
        const entityService = new EntityService();
        const entityList = await entityService.prepareEntites(_data);
        _socket.emit("entities", entityList);

    }

    handleEntityGetRequest = async (_socket, _data) => {

        const entityService = new EntityService(_data);
        const entity = await entityService.prepareEntity();
        _socket.emit("entity", entity);

    }

    handleCapabilityRequest = async (_socket, _roleId) => {

       // this.checkGatewaySocket(_socket);

        const roleService = new RoleService();
        const caps = await roleService.prepareCapabilities(_roleId);
        _socket.emit("capabilities", caps);

    }

    handleNotifyConfigRequest = async (_socket, _data) => {

        const preferenceService = new PreferenceService();
        const configs = await preferenceService.prepareNotifyConfig();
        _socket.emit("notify_config", configs);

    }

    handleDemandCapabilityRequest = async (_socket, _roleId) => {

        const roleService = new RoleService();
        const caps = await roleService.prepareCapabilities(_roleId);
        _socket.emit("demand_capabilities", caps);

    }

    handlePartnerFeatureRequest = async (_socket, _partnerId) => {
        
        const partnerService = new PartnerService();
        const partnerFeatures = await partnerService.listFeatures(_partnerId);
        _socket.emit("partner_features", partnerFeatures);

    }

    handleDemandPartnerFeatureRequest = async (_socket, _partnerId) => {
        
        const partnerService = new PartnerService();
        const partnerFeatures = await partnerService.listFeatures(_partnerId);
        _socket.emit("demand_partner_features", partnerFeatures);

    }

    handleMenusRequest = async (_socket) => {

        //this.checkGatewaySocket(_socket);

        const roleService = new RoleService();
        const menus = await roleService.prepareMenus();
        _socket.emit("menus", menus);

    }

    handleIssueTokenRequest = (_socket) => {
        console.log("handleIssueTokenRequest is called");
    }

    handleVerifyTokenRequest = (_socket, _token) => {         

        try {
            const result = this.tokenManager.verifyToken(_token);
            _socket.emit('verifyToken', result);
        } catch (_e) { console.log(_e);
            console.error(_e);
        }  

    }

    checkGatewaySocket = (_socket) => {
        /* First thing check the gateway socket is there, if not register it again */
        if (!this.clients["GATEWAY"] || !this.clients["GATEWAY"].connected) {
            this.clients["GATEWAY"] = _socket;
        }
    }

    handleClose = (_socket, _reason) => {
        console.log("Connection closed : "+ _reason);
    }

    handleDisconnect = (_socket, _reason) => {
        console.log("Connection disconnected : "+ _reason);
    }    

    handleError = (_err) => { 
        console.log(_err.req);      // the request object
        console.log(_err.code);     // the error code, for example 1
        console.log(_err.message);  // the error message, for example "Session ID unknown"
        console.log(_err.context);  // some additional error context
    }

}

const SocketManager = new SystemSocket();
export default SocketManager;