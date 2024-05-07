import AuthProvider from './authProvider';

class AuthService {
  constructor() {
    this.authProvider = new AuthProvider();
  }

  getUser() {
    let user = this.authProvider.getUser();

    return {...user, expired: Date.now() > user.exp};
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
    return this.authProvider.getUser().then((data) => (data ? data.access_token : null));
  }

  refreshAccessToken() {
    return this.authProvider.generateJwtToken().then((data) => (data ? data.access_token : null))
  }
}

const authService = new AuthService();

export default authService;
