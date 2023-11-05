import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

/**
 * 
 * @author : Sark
 * @version: 1.0.0
 * 
 * Responsible for issuing and verifying jwt tokens
 * 
 */
export default class TokenManager {
    
    constructor() {
        this.secretKey = process.env.JWT_SECRET_KEY;                
    }

    issueToken = (_userId) => {

        let data = {
            user: _userId,            
            time: Date()            
        }
        
        return jwt.sign(data, this.secretKey, { expiresIn: "24h" });

    }

    verifyToken = (_token) => {

        try {
                  
            const verified = jwt.verify(_token.trim(), this.secretKey);                        
            return {
                status: true,
                payload: verified
            };                             

        } catch (_e) {            
            return {
                status: false,
                payload: null
            };
        }
        
    }

}