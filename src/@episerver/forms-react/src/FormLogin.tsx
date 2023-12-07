import { FormAuthenticate, FormAuthenticateConfig, FormConstants, IdentityInfo, isNullOrEmpty } from "@episerver/forms-sdk";
import React, { useState } from "react";

interface FormLoginProps{
    clientId: string,
    authBaseUrl: string,
    onAuthenticated: (identityInfo: IdentityInfo) => void
}

export const FormLogin = (props: FormLoginProps) => {
    const [loginInfo, setLoginInfo] = useState<any>({
        username: "",
        password: ""
    });
    const formAuthenticate = new FormAuthenticate({
        clientId: props.clientId,
        grantType: "password",
        authBaseUrl: props.authBaseUrl
    } as FormAuthenticateConfig);
    const storage = window.sessionStorage;
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!isNullOrEmpty(storage.getItem(FormConstants.FormAccessToken) ?? ""));

    const handleChange = (e: any) => {
        setLoginInfo({...loginInfo, [e.target.name]: e.target.value});
    }

    const handleClick = (e:any) => {
        formAuthenticate.login(loginInfo.username, loginInfo.password).then((token) => {
            setIsAuthenticated(true);
            storage.setItem(FormConstants.FormAccessToken, token);
            props.onAuthenticated({ username: loginInfo.username, accessToken: token } as IdentityInfo);
        });
    }

    return (
        <>
            {isAuthenticated ? (<div className="Form__Authenticated">Authenticated</div>) : (
                <div className="Form__Login">
                    <div className="Form__Login__Username">
                        <label htmlFor="username">Username:</label>
                        <input id="username" name="username" type="text" onChange={handleChange} value={loginInfo.username} />
                    </div>
                    <div className="Form__Login__Password">
                        <label htmlFor="password">Password:</label>
                        <input id="password" name="password" type="password" onChange={handleChange} value={loginInfo.password} />
                    </div>
                    <div>
                        <button className="Form__Login__Submit" onClick={handleClick}>Login</button>
                    </div>
                </div>
            )}
        </>
    );
}