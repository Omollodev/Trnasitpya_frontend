"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getAuthHeaders, setAuthTokens, removeAuthTokens } from '@/utils/auth';
import { loginUser } from '@/lib/api-client';

interface User {
    id: number;
    email: string;
    name: string;
    isAdmin?: boolean;
    role?: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    loading: boolean;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const useProvideAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setLoading(true);
        try {
            // Get the token from cookies/localStorage through the utility function
            const headers = getAuthHeaders();
            
            // Make the request with Authorization header
            const response = await axios.get('/api/auth/profile/', { 
                headers: {
                    Authorization: `Bearer ${headers.Authorization.split(' ')[1]}`
                } 
            });
            
            setUser(response.data);
            setError(null);
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        
        try {
            const { token, refreshToken, user } = await loginUser(credentials);
            
            if (token) {
                setAuthTokens(token, refreshToken || '');
                setUser(user);
                
                // Check if user is admin and redirect accordingly
                if (user.isAdmin || user.role === 'admin') {
                    // Redirect admin users to admin dashboard
                    router.push('/admin/dashboard');
                } else {
                    // Redirect regular users to user dashboard
                    router.push('/dashboard');
                }
                return;
            } else {
                throw new Error('No token received');
            }
        } catch (error: any) {
            console.error("Failed to login:", error);
            setUser(null);
            
            // Set error message for UI feedback
            if (error.message) {
                setError(error.message);
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        removeAuthTokens();
        setUser(null);
        router.push('/login');
    };

    return {
        user,
        login,
        logout,
        loading,
        isLoading: loading,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin === true || user?.role === 'admin',
        error,
    };
};

export default useAuth;
 