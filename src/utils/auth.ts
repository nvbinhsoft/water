const TOKEN_KEY = 'blog_access_token';
const TOKEN_TYPE_KEY = 'blog_token_type';

export const setAuthToken = (accessToken: string, tokenType: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
};

export const getAuthToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const type = localStorage.getItem(TOKEN_TYPE_KEY) ?? 'Bearer';
  if (!token) return null;
  return { token, type };
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
};

export const isAuthenticated = () => Boolean(localStorage.getItem(TOKEN_KEY));
