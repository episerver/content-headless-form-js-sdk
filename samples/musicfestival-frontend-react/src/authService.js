import AuthProvider from './authProvider';

class AuthService {
  constructor() {
    this.authProvider = new AuthProvider();
  }

  getUser() {
    return new Promise( (resolve, reject) => {
      this.authProvider.getUser().then(user => {
        console.log(`JWT Bearer token for ${user.username}: ${user.access_token}`)
        resolve({...user, expired: Math.floor(Date.now() / 1000) > user.exp}) 
      })
    })
  }

  login() {
    const args = {
      state: window.location.href,
    };

    return this.authProvider.signinRedirect(args);
  }

  logout() {
    return this.authProvider.signoutRedirect();
  }

  getAccessToken() {
    return this.authProvider.getUser();
  }

  refreshAccessToken() {
    return this.authProvider.generateJwtToken()
  }
}

const authService = new AuthService();

export default authService;
