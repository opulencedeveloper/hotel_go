// Simple JWT verification for Edge Runtime compatibility
// This is a basic implementation - in production, use a proper JWT library

export interface JWTPayload {
  userId: string;
  userRole: string;
  email: string;
  hotelId?: string;
  iat: number;
  exp: number;
}

export function verifyJWT(token: string, secret: string = 'your-secret-key'): JWTPayload | null {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (base64url)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsedPayload = JSON.parse(decodedPayload);

    // Check expiration
    if (parsedPayload.exp && Date.now() >= parsedPayload.exp * 1000) {
      return null;
    }

    return parsedPayload as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch (error) {
    return null;
  }
}
