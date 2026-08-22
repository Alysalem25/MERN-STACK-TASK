const TOKEN_KEY = "token";
const USER_KEY = "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  number?: string;
}

export const saveAuthData = (
  token: string,
  user: AuthUser
) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem(USER_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const logout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};