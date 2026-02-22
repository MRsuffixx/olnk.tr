import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Token storage
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

// Load tokens from localStorage on init
if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
}

// Request interceptor — attach auth token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle 401 and refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = typeof window !== 'undefined'
                ? localStorage.getItem('refreshToken')
                : null;

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                    });

                    const newTokens = data.data;
                    setAccessToken(newTokens.accessToken);
                    localStorage.setItem('accessToken', newTokens.accessToken);
                    localStorage.setItem('refreshToken', newTokens.refreshToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                    }
                    return api(originalRequest);
                } catch {
                    // Refresh failed — clear tokens
                    setAccessToken(null);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login';
                    }
                }
            }
        }

        return Promise.reject(error);
    },
);

export default api;
