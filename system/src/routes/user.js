import { Router } from "express";
import UserService from "../services/user.js";
import Utils from "../utils/utils.js";

export default class UserRouter {

    constructor() {

        this.router = new Router();
        this.userService = new UserService();

        this.router.get("/user/check", this.check);
        this.router.get("/user/secret", this.check);
        this.router.get("/user/reset", this.check);
        this.router.post("/user/sign-in", this.signin);
        this.router.post("/user/sign-out", this.signout);        
        this.router.get("/user/resend-otp", this.resendOtp);        

        this.router.get("/user/:id", this.get);
        this.router.get("/user", this.list);               
        this.router.post("/user", this.create);
        this.router.put("/user/:id", this.update);
        this.router.delete("/user/:id", this.delete);

    }

    getRoutes = () => {
        return this.router;
    };
    
    get = async (_req, _res) => {
        try {
            _res.status(200).json(await this.userService.get(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };

    list = async (_req, _res) => {
        try {
            _res.status(200).json(await this.userService.list(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };
    
    signin = async (_req, _res) => {    
        try {
            _res.status(200).json(await this.userService.signin(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };
    
    signout = async (_req, _res) => {};
    
    check = async (_req, _res) => {        
        try {
            _res.status(200).json(await this.userService.check(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };
    
    list = async (_req, _res) => {
        try {
            _res.status(200).json(await this.userService.list(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };
    
    count = async (_req, _res) => {
        try {
            _res.status(200).json(await this.userService.count(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };
    
    create = async (_req, _res) => {
        try {
            _res.status(200).json(await this.userService.create(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };
    
    update = async (_req, _res) => {
        try {
            _res.status(200).json(await this.userService.update(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };
    
    delete = async (_req, _res) => {
        try {
            _res.status(200).json(await this.userService.delete(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };
    
    resendOtp = async (_req, _res) => {
        try {
            _res.status(200).json(await this.userService.resendOtp(_req));
        } catch (_e) {
            Utils.handleError(_e, _res);
        }
    };

}