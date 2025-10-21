// Best practice token storage for Next.js hotel management application
import Cookies from 'js-cookie';

// Token storage configuration
const TOKEN_CONFIG = {
  // Main auth token (httpOnly cookie set by server)
  AUTH_TOKEN: 'auth-token',
  // User session data (client-side for UI state)
  USER_SESSION: 'user-session',
  // Refresh token (httpOnly cookie set by server)
  REFRESH_TOKEN: 'refresh-token',
  // Remember me preference
  REMEMBER_ME: 'remember-me',
  // Cookie expiration times
  EXPIRY: {
    SHORT: 1, // 1 day for regular sessions
    LONG: 30, // 30 days for remember me
    REFRESH: 90, // 90 days for refresh token
  }
};

// Secure cookie options for production
const getCookieOptions = (expires: number) => ({
  expires,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict' as const, // CSRF protection
  path: '/', // Available site-wide
});

// User session interface
export interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  propertyId: string;
  permissions: string[];
  hotelId?: string;
  lastActivity: number;
}

// Token storage class
class TokenStorage {
  // Set user session data (client-side)
  setUserSession(userData: Partial<UserSession>, rememberMe: boolean = false): void {
    const session: UserSession = {
      id: userData.id || '',
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: userData.role || '',
      department: userData.department || '',
      propertyId: userData.propertyId || '',
      permissions: userData.permissions || [],
      hotelId: userData.hotelId,
      lastActivity: Date.now(),
    };

    const expiry = rememberMe ? TOKEN_CONFIG.EXPIRY.LONG : TOKEN_CONFIG.EXPIRY.SHORT;
    
    Cookies.set(TOKEN_CONFIG.USER_SESSION, JSON.stringify(session), getCookieOptions(expiry));
    Cookies.set(TOKEN_CONFIG.REMEMBER_ME, rememberMe.toString(), getCookieOptions(expiry));
  }

  // Get user session data
  getUserSession(): UserSession | null {
    try {
      const sessionData = Cookies.get(TOKEN_CONFIG.USER_SESSION);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData) as UserSession;
      
      // Check if session is expired (inactivity timeout)
      const now = Date.now();
      const maxInactivity = 24 * 60 * 60 * 1000; // 24 hours
      
      if (now - session.lastActivity > maxInactivity) {
        this.clearUserSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error parsing user session:', error);
      this.clearUserSession();
      return null;
    }
  }

  // Update last activity timestamp
  updateLastActivity(): void {
    const session = this.getUserSession();
    if (session) {
      session.lastActivity = Date.now();
      const rememberMe = this.getRememberMe();
      const expiry = rememberMe ? TOKEN_CONFIG.EXPIRY.LONG : TOKEN_CONFIG.EXPIRY.SHORT;
      Cookies.set(TOKEN_CONFIG.USER_SESSION, JSON.stringify(session), getCookieOptions(expiry));
    }
  }

  // Check if user is authenticated (has valid session)
  isAuthenticated(): boolean {
    const session = this.getUserSession();
    return session !== null && session.id !== '';
  }

  // Get remember me preference
  getRememberMe(): boolean {
    return Cookies.get(TOKEN_CONFIG.REMEMBER_ME) === 'true';
  }

  // Clear all authentication data
  clearUserSession(): void {
    Cookies.remove(TOKEN_CONFIG.USER_SESSION);
    Cookies.remove(TOKEN_CONFIG.REMEMBER_ME);
    // Note: httpOnly cookies (auth-token, refresh-token) are cleared by server
  }

  // Get token for API requests (this will be handled by server-side httpOnly cookies)
  getTokenForAPI(): string | null {
    // In a real implementation, the token would be automatically sent by the browser
    // from httpOnly cookies. For client-side API calls, we need to handle this differently.
    // This is a placeholder - the actual token will be sent via httpOnly cookies.
    return null;
  }

  // Check if we should refresh the token
  shouldRefreshToken(): boolean {
    const session = this.getUserSession();
    if (!session) return false;

    const now = Date.now();
    const tokenAge = now - session.lastActivity;
    const refreshThreshold = 4 * 60 * 60 * 1000; // 4 hours

    return tokenAge > refreshThreshold;
  }

  // Get user permissions
  getUserPermissions(): string[] {
    const session = this.getUserSession();
    return session?.permissions || [];
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions();
    if (permissions.includes('*')) return true;
    return permissions.some(p => 
      p === permission || 
      (p.endsWith('.*') && permission.startsWith(p.slice(0, -2)))
    );
  }

  // Get user role
  getUserRole(): string | null {
    const session = this.getUserSession();
    return session?.role || null;
  }

  // Get user ID
  getUserId(): string | null {
    const session = this.getUserSession();
    return session?.id || null;
  }

  // Get hotel ID
  getHotelId(): string | null {
    const session = this.getUserSession();
    return session?.hotelId || null;
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage();

// Export configuration for server-side use
export { TOKEN_CONFIG };
