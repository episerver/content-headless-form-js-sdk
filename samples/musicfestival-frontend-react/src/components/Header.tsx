import { useEffect, useState } from 'react';
import authService from '../authService';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { FormCache, FormConstants } from '@episerver/forms-sdk';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const formCache = new FormCache();

    useEffect(() => {
        authService.getUser().then((user: any) => {
            if(user && user.expired) {
                authService.refreshAccessToken().then((_: any) => {
                    authService.getUser().then((_user: any) => { user = _user })
                })
            }

            if (user && user.authenticated && !user.expired) {
                setIsLoggedIn(true);
                setUsername(user.username || "");
                formCache.set<string>(FormConstants.FormAccessToken, user.access_token);
            }
        });
    }, [])

    return (
        <nav className="Page-container LoginBar">
            {isLoggedIn ? <LogoutButton username={username} /> : <LoginButton />}
        </nav>
    );
}

export default Header;
