export class TokenManager {
  static getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  static setToken(token, rememberMe = false) {
    if (!token) return;
    
    if (rememberMe) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }
  }

  static removeToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  static isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  static shouldRefreshToken(token) {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;
      
      // Refresh if token expires in less than 5 minutes
      return timeUntilExpiry < 300;
    } catch (error) {
      return false;
    }
  }

  static clearAllAuthData() {
    this.removeToken();
    // Clear any other auth-related data
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }
}