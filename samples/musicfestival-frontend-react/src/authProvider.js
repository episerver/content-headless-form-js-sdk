const jose = require('jose');

class AuthProvider{
    // Secret key used to sign the JWT token
    constructor() {
        this.SECRET_KEY = 'TOPSIGNSECRET';
    }

    getUser() {
        return sessionStorage.getItem('user');
    }

    async generateJwtToken(username) {
        // JWT payload containing user information
        const payload = {
            username: username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)  // Token expiration time (1 day)
        };

        const token = await new jose.EncryptJWT({ 'name': username })
            .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
            .setIssuedAt()
            .setIssuer('tsng')
            .setExpirationTime('1d')
            .encrypt(this.SECRET_KEY)

        sessionStorage.setItem('user', {access_token: token, ...payload});
        console.log(`JWT Token for ${username}: ${token}`)

        return token;
    }

    signinRedirect(args) {
        if (args.username === 'sample_user' && args.password === 'sample_password') {
            this.generateJwtToken(args.username);
            window.location.href = args.state
        } else {
            return false;
        }
    }

    signoutRedirect() {
    }

    refreshAccessToken() {
        this.getUser().then(user => {
            return this.generateJwtToken(user.username);
        })
    }
}

export default AuthProvider;
