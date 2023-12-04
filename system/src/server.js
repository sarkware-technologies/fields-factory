import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import routes from "./routes/index.js"
import DBM from "./utils/db-manager.js";
import SystemSocket from "./utils/socket-manager.js"

class SystemServer {

    constructor() {

        /* Load the express */
        this.app = express();
        this.setupMiddlewares(); 
        this.setupRoutes();               
        
    }

    setupMiddlewares = () => {

        this.app.use((_req, _res, _next) => {
            console.log(_req.originalUrl);
            _next();
        });

        /* Global exception handler */
        this.app.use((_err, _req, _res, _next) => {
            
            if (!_err) {
                return _next();
            }        
            
            _res.status(500);
            _res.setHeader('content-type', 'text/plain');
            _res.send('Internal server error');

        });

        /* Process level exception handler (anything escape over the Global Exception Handler) */
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err);        
        });

        this.app.use(cors());
        this.app.use(express.json());  

    }

    setupRoutes = () => {    

        /* Register routes */
        this.app.use('/system', cors(), routes);
        /* Catch all invalide request */
        this.app.get("*", (req, res) => {
            res.status(500);
            res.send("API NOT FOUND");
        });

    }

    listen = async () => {

        await DBM.connect();
        if (DBM.checkConnection()) {
            this.app.listen(process.env.PORT);
        } else {
            console.log("DB connection error");
        }
        
    }

}

/* Kick start the server */
const server = new SystemServer();
server.listen();