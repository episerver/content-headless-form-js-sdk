import { FormAuthenticate, FormAuthenticateConfig, FormCache, FormConstants, IdentityInfo, isNullOrEmpty } from "@episerver/forms-sdk";
import React, { useEffect, useState } from "react";

interface FormLoginProps{
    /**
     * Client Id that's allowed access API
     */
    clientId: string,
    /**
     * Endpoint to get access token
     */
    authBaseUrl: string,
    /**
     * Callback function when authenticated
     * @param identityInfo 
     * @returns 
     */
    onAuthenticated?: (identityInfo: IdentityInfo) => void
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
    const formCache = new FormCache();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!isNullOrEmpty(formCache.get<string>(FormConstants.FormAccessToken)));

    const handleChange = (e: any) => {
        setLoginInfo({...loginInfo, [e.target.name]: e.target.value});
    }

    const handleClick = () => {
        formAuthenticate.login(loginInfo.username, loginInfo.password).then((token) => {
            setIsAuthenticated(true);
            formCache.set<string>(FormConstants.FormAccessToken, token);
            props.onAuthenticated && props.onAuthenticated({ username: loginInfo.username, accessToken: token } as IdentityInfo);
        });
    }

    useEffect(()=>{
        let intervalId = setInterval(()=>{
            let accessToken = formCache.get<string>(FormConstants.FormAccessToken);
            if(isNullOrEmpty(accessToken)){
                setIsAuthenticated(false);
            }
        },1000);
        return ()=>{
            clearInterval(intervalId);
        }
    },[]);

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