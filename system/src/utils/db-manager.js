import mongoose from "mongoose";

class DbManager {

    constructor() {

        this.db = null;          
        this.errorMessage = null;        
        this.reconnectCount = 0;
        this.disconnectedCount = 0;
        this.options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

    }

    connect = async () => {

        const mongoURI = this.buildHostUrl();

        try {
            await mongoose.connect(mongoURI, this.options);
        } catch (error) {
            console.error('MongoDB connection error:', error.message);
        }

        this.db = mongoose.connection;
        this.db.on("connected", this.handleConnected);
        this.db.on("reconnect", this.handleReConnected);
        this.db.on("disconnected", this.handleDisconnected);
        this.db.on("error", this.handleError);

        process.on('SIGINT', this.handleExitSignal);

    }

    handleError = _err => {
        console.error('MongoDB connection error: ', _err.message);
    }

    handleConnected = () => {
        console.log('Connected to MongoDB!');
    }

    handleDisconnected = () => {
        this.disconnectedCount++;
        console.log('MongoDB disconnected!');
    }

    handleReConnected = () => {
        this.reconnectCount++;
        console.log('MongoDB reconnected!');
    }

    handleExitSignal = () => {
        if (this.db) {
            try {
                this.db.close();
                console.log('MongoDB connection closed due to app termination');
            } catch (_e) {  
                console.error(_e);
            }
            
            process.exit(0);
        }        
    }

    buildHostUrl = () => "mongodb://"+ process.env.MONGO_HOST +":"+ process.env.MONGO_PORT +"/"+ process.env.MONGO_DB;

    getErrorMesage = () => this.errorMessage;

    checkConnection = () => (this.db.readyState === 1) ? true : false;    
    
    getReconnectedCount = () => this.reconnectCount;

    getDisconnectedCount = () => this.disconnectedCount;

}

export default new DbManager();