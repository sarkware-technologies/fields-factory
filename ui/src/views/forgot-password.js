import React, { useState } from 'react';

const ForgotPassword = (props) => {

    const [state, setState] = useState({
        view: "target",   // target, secret & reset
        target: "",
        authType: 1,        // 1=PASSWORD, 2=OTP        
        challenge: "",
        password: "",
        confirmPassword: "",
        isTargetEmpty: false,
        isSecretEmpty: false,
        isPassEmpty: false,
        isConfirmEmpty: false        
    });

    const handleTarget = (_e) => {
        let isEmpty = true;
        if (_e.target.value) {
            isEmpty = false;
        } 
        setState((prevState) => ({...prevState, target: _e.target.value, isTargetEmpty: isEmpty}));
    }

    const handleSecret = (_e) => {
        let isEmpty = true;
        if (_e.target.value) {
            isEmpty = false;
        } 
        setState((prevState) => ({...prevState, target: _e.target.value, isTargetEmpty: isEmpty}));
    }

    const handlePrevBtnClick = (_e) => {
        
    }

    const handleNextBtnClick = (_e) => {
        
    }

    const handleSignInBtnClick = () => {

    }

    const handleLoginLinkClick = () => {
        document.location.href = "/";
    }

    const renderFormFields = () => {
        if (state.view === "target") {          
            if (state.authType == 1) {
                return (
                    <>
                        <input type='text' placeholder='Enter your email' onChange={handleTarget} value={state.password} />
                        <p className={`ff-form-error-message ${state.isEmpty ? "error" : ""}`}>Please enter your email</p>
                    </>
                );
            } else if (state.authType == 2) {
                return (
                    <>
                        <input type='text' placeholder='Enter your mobile number' onChange={handleTarget} value={state.otp} />
                        <p className={`ff-form-error-message ${state.isEmpty ? "error" : ""}`}>Please enter your mobile number</p>
                    </>
                );
            } 
        } else if (state.view === "secret") {          
            if (state.authType == 1) {
                return (
                    <>
                        <input type='password' placeholder='Enter secret' onChange={handleSecret} value={state.password} />
                        <p className={`ff-form-error-message ${state.isSecretEmpty ? "error" : ""}`}>Please enter the password</p>
                    </>
                );
            } else if (state.authType == 2) {
                return (
                    <>
                        <input type='password' placeholder='Enter OTP' onChange={handleSecret} value={state.otp} />
                        <p className={`ff-form-error-message ${state.isSecretEmpty ? "error" : ""}`}>Please enter the received OTP</p>
                    </>
                );
            } 
        }
    }

    const renderActions = () => {
        if (state.view === "target") {
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
                    <p><span>Reset Password</span></p>
                </div>

                <div className="ff-form-row">{renderFormFields()}</div>
                <a href="#" onClick={handleLoginLinkClick}>back to login</a>
                <div className="ff-form-action">{renderActions()}</div>

            </div>

        </div>

    )

};

export default ForgotPassword;