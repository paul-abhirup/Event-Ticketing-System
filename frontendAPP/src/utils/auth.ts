export const getAuthToken = () => localStorage.getItem('authToken');

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  // You might want to clear other auth-related data here
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
}; 