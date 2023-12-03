import React, { createRef } from "react";
import Login from "./views/login";
import ForgotPassword from "./views/forgot-password";

export default class Controller extends React.Component {

    constructor(props) {
        super(props);
    
        /* Holds the context stats */
        this.store = {};
        /* Holds the current name of the context */
        this.current = null;
        /*  */
        this.instances = {};
        //this.helper = new Helper();
        /*  */
        this.ContextBar = createRef();
        /*  */
        this.notification = createRef();
        /*  */
        this.state = { theme: "", locale: "", menus: [] };
        /*  */
        window["_controller"] = this;
    }

    isAuthenticated = () => {
        return false;
    };

    render = () => {
        
        if (this.isAuthenticated()) {            
    
            return (
                <>                                        
                </>
            );

        } else {

            const query = new URLSearchParams(window.location.search);
            const view = query.get('view');

            if (view && (view === "forgot-password")) {
                return <ForgotPassword />;
            } else {
                return <Login />;
            }

        }

    };

}