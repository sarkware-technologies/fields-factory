import React, { useState } from 'react';

const Login = (props) => {

    const [state, setState] = useState({
        view: "username",   // username or password
        username: "",
        authType: 1,        // 1=PASSWORD, 2=OTP
        password: "",
        otp: "",
        isUserEmpty: false,
        isPassEmpty: false,
        isOtpEmpty: false
    });

    const handleUserChange = (_e) => {
        let isEmpty = true;
        if (_e.target.value) {
            isEmpty = false;
        } 
        setState((prevState) => ({...prevState, username: _e.target.value, isUserEmpty: isEmpty}));
    }

    const handlePasswordChange = (_e) => {
        let isEmpty = true;
        if (_e.target.value) {
            isEmpty = false;
        }
        setState((prevState) => ({...prevState, password: _e.target.value, isPassEmpty: isEmpty}));
    }

    const handleOtpChange = (_e) => {
        let isEmpty = true;
        if (_e.target.value) {
            isEmpty = false;
        }
        setState((prevState) => ({...prevState, otp: _e.target.value, isOtpEmpty: isEmpty}));
    }

    const handleNextBtnClick = (_e) => {
        
        if (!state.username) {
            setState((prevState) => ({...prevState, isValid: false}));
            return;
        }

        window._controller.dock(
            {
                method: "GET",
                endpoint: "/system/users/check?user="+ state.username                
            }, 
            (_req, _res) => {
                
                if (_res.status) {
                    setState((prevState) => ({...prevState, view: "authentication", authType: _res.payload.auth_type}));
                } else {
                    window._controller.notify(_res.message, "error");
                }

            }, 
            (_req, _res) => {
                console.log(_res);
            }
        );

        //setState((prevState) => ({...prevState, view: "authentication"}));
    }

    const handlePrevBtnClick = (_e) => {
        setState((prevState) => ({...prevState, view: "username"}));
    }

    const handleSignInBtnClick = () => {

        if (state.authType == 1 && state.isPassEmpty) {
            return;
        } else if (state.authType == 2 && state.isOtpEmpty) {
            return;
        }

        window._controller.dock(
            {
                method: "POST",
                endpoint: "/system/users/sign-in",
                payload: {user: state.username, password: state.password, otp: state.otp}
            }, 
            (_req, _res) => {
                
                if (_res.status) {

                    /* Successfully signed in */
                    sessionStorage.setItem("ff_user", _res.payload.user);
                    sessionStorage.setItem("ff_token", _res.payload.token);
                    //sessionStorage.setItem("ff_menu", JSON.stringify(_res.payload.menu));                     

                    document.location.href = "";                    

                } else {
                    window._controller.notify(_res.message, "error");
                }

            }, 
            (_req, _res) => {
                console.log(_res);
            }
        );

    }

    const handleForgotLinkClick = (_e) => {
        document.location.href = "?view=forgot-password";
    }

    const renderFormFields = () => {
        if (state.view === "username") {
            return (
                <>
                    <input type='text' placeholder='Email or Phone' onChange={handleUserChange} value={state.username} />
                    <p className={`ff-form-error-message ${state.isUserEmpty ? "error" : ""}`}>Please enter you email or phone number</p>
                </>
            );
        } else {
            if (state.authType == 1) {
                return (
                    <>
                        <input type='password' placeholder='Enter Password' onChange={handlePasswordChange} value={state.password} />
                        <p className={`ff-form-error-message ${state.isPassEmpty ? "error" : ""}`}>Please enter the password</p>
                    </>
                );
            } else if (state.authType == 2) {
                return (
                    <>
                        <input type='password' placeholder='Enter OTP' onChange={handleOtpChange} value={state.otp} />
                        <p className={`ff-form-error-message ${state.isOtpEmpty ? "error" : ""}`}>Please enter the received OTP</p>
                    </>
                );
            } 
        }
    }

    const renderActions = () => {
        if (state.view === "username") {
            return <button className='ff-btn primary block icon-left' onClick={handleNextBtnClick}>Next <i className='far fa-caret-right'></i> </button>;
        } else {
            return (
                <>
                <button className='ff-btn secondary block icon-left' onClick={handlePrevBtnClick}><i className='far fa-caret-left'></i> Back</button>
                <button className='ff-btn primary block icon-left' onClick={handleSignInBtnClick}>Sign in&nbsp;&nbsp;<i className="far fa-right-to-bracket"></i></button>
                </>
            );
        }   
    }

    return (

        <div className="ff-login-wrapper">
            
            <div className="ff-login-form">

                <h1 className='ff-login-form-title'>Fields Factory</h1>
                
                <div className="ff-login-form-header">
                    <img src="/assets/imgs/green-logo.png" />                    
                    <p><span>Sign in</span>to continue</p>
                </div>

                <div className="ff-form-row">{renderFormFields()}</div>
                <a href="#" onClick={handleForgotLinkClick}>Forgot Password</a>
                <div className="ff-form-action">{renderActions()}</div>

            </div>

        </div>

    )

}

export default Login;

