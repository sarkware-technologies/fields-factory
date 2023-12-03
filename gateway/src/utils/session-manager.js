import CacheManager from "./cache-manager";

/**
 *
 * @author  : Sark
 * @version : 1.0.0
 * @description : 
 *
 */
class Session {

    constructor() {

        if (Session.instance) {
            return Session.instance;
        }

        this.timers = {};
        this.expirationTime = 3600 * 24 * 1000; // 24 Hrs

        Session.instance = this;

    }

    /* Initializing session timer */
    initTimer = (_uid) => {
        if (!this.timers[_uid]) {
            this.timers[_uid] = setTimeout(() => {
                CacheManager.removeAuth(_uid);
                delete this.timers[_uid];
            }, this.expirationTime);
        }
    };

    /* Resting session timer */
    resetTimer = (_uid) => {
        if (this.timers[_uid]) {
            clearTimeout(this.timers[_uid]);
            delete this.timers[_uid];
            this.initTimer(_uid);
        }
    };

}

// Create a single instance of the SessionManager class
const SessionManager = new Session();

// Export the instance to make it accessible from other modules
export default SessionManager;
