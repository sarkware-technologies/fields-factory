/**
 * 
 * @author Sark
 * @version 1.0.0
 * 
 */
class Cache {

    constructor() {

        if (!Cache.instance) {

            this.authCache = {};
            this.routeCache = {};
            this.capCache = {};                 

            Cache.instance = this;

        }
  
        return Cache.instance;

    }

    setAuth = (_key, _value) => {
        this.authCache[_key] = _value;
    }
  
    setRoutes = (_value) => {
        this.routeCache = _value;
    }

    setCap = (_key, _value) => {
        this.capCache[_key] = _value;
    }

    getAuth = (_key) => {
        return this.authCache[_key];
    }
  
    getRoutes = () => {
        return this.routeCache;
    }

    getCap = (_key) => {
        return this.capCache[_key];
    }

    removeAuth = (_key) => {
        delete this.authCache[_key];
    }

    removeCap = (_key) => {
        delete this.capCache[_key];
    }

    removePartner = (_key) => {
        delete this.partnerCache[_key];
    }

}

// Create a single instance of the Cache class
const CacheManager = new Cache();
  
// Export the instance to make it accessible from other modules
export default CacheManager;