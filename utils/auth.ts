import axios, { AxiosError } from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Define the API URL
const API_URL = 'http://localhost:8000/api';

// Create axios instance with base URL and CORS settings
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for CORS
});

// Token management functions
export const setAuthTokens = (accessToken: string, refreshToken: string) => {
    setCookie('accessToken', accessToken);
    setCookie('refreshToken', refreshToken);
    // Set default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

export const removeAuthTokens = () => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
};

export const getAuthHeaders = () => {
    const accessToken = getCookie('accessToken');
    return {
        Authorization: `Bearer ${accessToken}`
    };
};

// Token refresh function
export const refreshAccessToken = async () => {
    try {
        const refreshToken = getCookie('refreshToken');
        const response = await api.post('/auth/token/refresh/', {
            refresh: refreshToken
        });
        
        setAuthTokens(response.data.access, refreshToken as string);
        return response.data.access;
    } catch (error) {
        removeAuthTokens();
        throw error;
    }
};

// Setup axios interceptors for automatic token refresh
api.interceptors.request.use(
    (config) => {
        const token = getCookie('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const accessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure (redirect to login)
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth helper functions
export const isAuthenticated = () => {
    return !!getCookie('accessToken');
};

// Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: number;
        email: string;
        name: string;
    };
    tokens: {
        access: string;
        refresh: string;
    };
}

// API functions
export const loginUser = async (credentials: LoginCredentials) => {
    try {
        const response = await api.post('/auth/login/', credentials);
        
        // Extract tokens from different possible response formats
        const accessToken = response.data.access || 
                          (response.data.tokens ? response.data.tokens.access : response.data.token);
        const refreshToken = response.data.refresh || 
                           (response.data.tokens ? response.data.tokens.refresh : response.data.refreshToken);
        
        // Store tokens in cookies
        if (accessToken) {
            setAuthTokens(accessToken, refreshToken || '');
        }
        
        return {
            user: response.data.user,
            token: accessToken,
            refreshToken: refreshToken
        };
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

export const logoutUser = async () => {
    try {
        await api.post('/auth/logout/');
        removeAuthTokens();
    } catch (error) {
        console.error('Logout failed:', error);
        // Remove tokens anyway
        removeAuthTokens();
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/user/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Registration function
export const registerUser = async (userData: {
    full_name: string;
    email: string;
    phone: string;
    password: string;
}) => {
    try {
        // Use api instance with proper configuration
        const response = await api.post('/auth/register/', userData);
        console.log('Registration response:', response.data); // For debugging
        return response.data;
    } catch (error) {
        console.error('Registration error details:', error); // For debugging
        if (axios.isAxiosError(error)) {
            // Handle Axios errors
            if (error.response) {
                // The server responded with an error
                const errorMessage = error.response.data.error || error.response.data.message || 'Registration failed';
                if (typeof errorMessage === 'object') {
                    // Handle validation errors
                    const messages = Object.entries(errorMessage)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                    throw new Error(messages);
                }
                throw new Error(errorMessage);
            } else if (error.request) {
                // The request was made but no response received
                throw new Error('No response from server. Please check your connection.');
            }
        }
        // Handle other types of errors
        throw new Error('An unexpected error occurred during registration.');
    }
};
