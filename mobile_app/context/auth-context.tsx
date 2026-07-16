import { api, setApiToken } from '../lib/api';
import * as SecureStore from 'expo-secure-store';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

const TOKEN_KEY = 'invigilator_token';

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface AuthContextValue {
    isLoading: boolean;
    token: string | null;
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        (async () => {
            const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

            if (storedToken) {
                setApiToken(storedToken);

                try {
                    const response = await api.get<AuthUser>('/invigilator/me');
                    setToken(storedToken);
                    setUser(response.data);
                } catch {
                    await SecureStore.deleteItemAsync(TOKEN_KEY);
                    setApiToken(null);
                }
            }

            setIsLoading(false);
        })();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post<{ token: string; user: AuthUser }>('/invigilator/login', { email, password });

        await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
        setApiToken(response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
    };

    const logout = async () => {
        try {
            await api.post('/invigilator/logout');
        } catch {
            // token may already be invalid server-side; proceed to clear local state regardless
        }

        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setApiToken(null);
        setToken(null);
        setUser(null);
    };

    return <AuthContext.Provider value={{ isLoading, token, user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
