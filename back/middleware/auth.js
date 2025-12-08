export const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    // Rediriger vers login...
};