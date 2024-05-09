const jose = require('jose');

class AuthProvider{
    // Secret key used to sign the JWT token
    constructor() {
    }

    generateSessionId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 20; // You can adjust the length of the session ID as needed
        let sessionId = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            sessionId += characters[randomIndex];
        }
    
        return `anonymous_${sessionId}`;
    }

    async generateJwtToken(username, authenticated) {
        if (!username)
        {
            username = this.generateSessionId();
            authenticated = false;
        } else {
            authenticated = authenticated ?? true;
        }

        const payload = {
            username: username,
            authenticated: authenticated,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)  // Token expiration time (1 day)
        }; 

        const token = await fetch(`http://localhost:8082/api/JwtToken/GetJwtToken?username=${username}`)

        sessionStorage.setItem('user', JSON.stringify({access_token: await token.json(), ...payload}));

        return token;
    }

    getUser() {
        return new Promise((resolve, reject) => { 
            const user = sessionStorage.getItem('user');
            
            user ? resolve(JSON.parse(user)) : 
                this.generateJwtToken(null).then(data => resolve(JSON.parse(sessionStorage.getItem('user'))))
        })
    }

    signinRedirect(args) {
        this.generateJwtToken("authenticated_user");
        window.location.href = args.state
    }

    signoutRedirect() {
        this.generateJwtToken(null);
        window.location.reload();
    }

    refreshAccessToken() {
        this.getUser().then(user => {
            return this.generateJwtToken(user.username, user.authenticated);
        })
    }
}

export default AuthProvider;
