// Authentication utility functions
export interface AuthUser {
  token: string;
  // Add more user properties as needed
}

// Token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('adminToken');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// Logout function - clears all auth data and redirects
export const logout = (): void => {
  // Clear all authentication-related data
  removeAuthToken();
  
  // Clear any other potential auth-related items
  localStorage.removeItem('userData');
  localStorage.removeItem('userPreferences');
  localStorage.removeItem('lastLoginTime');
  
  // Clear session storage if any
  sessionStorage.clear();
  
  // Force page reload to clear any in-memory state
  // This ensures all components are reset
  window.location.href = '/';
};

// Validate token format (basic validation)
export const isValidToken = (token: string): boolean => {
  // Basic JWT token validation (has 3 parts separated by dots)
  return token && token.split('.').length === 3;
};

// Get token expiration (if JWT)
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  return expiration ? expiration < new Date() : false;
};

// Auto-logout if token is expired
export const checkTokenExpiration = (): boolean => {
  const token = getAuthToken();
  if (token && isTokenExpired(token)) {
    logout();
    return true;
  }
  return false;
};
