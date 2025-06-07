const BASE_URL = 'http://localhost:5294';

const request = async (method, path, body = null) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${path}`, options);

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || `Request failed: ${res.status}`);
    }

    // Check if there's content to parse
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json') && res.status !== 204) {
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    }

    return null;
};
// src/Components/api.js - update checkAdminStatus function
export const checkAdminStatus = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return false;
    }

    try {
        // Add a fallback mechanism to handle missing backend endpoint
        // This will allow your app to continue working while you fix the backend

        // Option 1: If you have user data with roles available
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.roles?.includes('Admin') || user.role === 'Admin') {
                console.log('Admin status verified from local storage');
                return true;
            }
        }

        // Option 2: Try the API call (but handle failure gracefully)
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            // First try the initialize-admin endpoint
            const res = await fetch(`${BASE_URL}/api/Admin/initialize`, options);

            if (res.ok) {
                return true;
            }

            if (res.status === 401 || res.status === 403) {
                console.warn('User is not authorized as admin');
                return false;
            }

            // If endpoint doesn't exist (404), user might still be admin
            // Just can't verify with backend yet
            console.warn('Admin endpoint not available - using role-based fallback');
            return false;
        } catch (error) {
            console.error('API error during admin check:', error);
            return false;
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};
// Admin
export const createSnowball = (data) => request('POST', '/api/Admin/snowball', data);
export const updateSnowball = (id, data) => request('PUT', `/api/Admin/snowball/${id}`, data);
export const deleteSnowball = (id) => request('DELETE', `/api/Admin/snowball/${id}`);
export const initializeData = () => request('POST', '/api/Admin/initialize');

// Login & Register
export const registerUser = (data) => request('POST', '/api/LoginAndRegister/register', data);
export const loginUser = (data) => request('POST', '/api/LoginAndRegister/login', data);
export const getUserRoles = () => request('POST', '/api/LoginAndRegister/roles');

// Snowball
export const getSnowballs = () => request('GET', '/api/Snowball');
export const getSnowballById = (id) => request('GET', `/api/Snowball/${id}`);

// User Cart
export const addToCart = (userId, snowballId) =>
    request('POST', `/api/UserCart/${userId}/add/${snowballId}`);
export const removeFromCart = (userId, snowballId) =>
    request('POST', `/api/UserCart/${userId}/remove/${snowballId}`);
export const getCartSummary = (userId) =>
    request('GET', `/api/UserCart/${userId}/summary`);
export const clearCart = (userId) =>
    request('POST', `/api/UserCart/${userId}/clear`);
export const placeOrder = (userId) =>
    request('POST', `/api/UserCart/${userId}/order`);
