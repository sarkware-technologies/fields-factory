import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();

import CacheManager from "./cache-manager";

class Socket {

    constructor() {

        this.reconnectCount = 0;
        this.disconnectedCount = 0;

        this.socket = io.connect(process.env.SYSTEM_SOCKET_SERVER, { reconnection: true });        

        this.socket.on('connect', () => { 
            console.log("Connection established with System Service");
            this.reconnectCount++;
            this.socket.emit("register", "GATEWAY");
        });

        this.socket.on('disconnect', () => this.disconnectedCount++);

    }



}

const SocketManager = new Socket();
export default SocketManager;