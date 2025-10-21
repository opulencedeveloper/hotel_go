import { tokenStorage } from "@/lib/auth-storage";

export function getAuthSessionInfo() {
  // With httpOnly cookies, the token is automatically sent by the browser
  // We only need to check if the user session is valid
  const isAuthenticated = tokenStorage.isAuthenticated();
  
  return { 
    token: isAuthenticated ? 'httpOnly-cookie' : null,
    isAuthenticated 
  };
}

export function removeAuthSessionInfo() {
  // Clear client-side session data
  tokenStorage.clearUserSession();
  
  // Note: httpOnly cookies are cleared by server on logout
}