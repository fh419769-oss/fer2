
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (username: string, pass: string) => boolean;
    logout: () => void;
    signup: (username: string, pass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useLocalStorage<User | null>('parish-user', null);
    const [users, setUsers] = useLocalStorage<Record<string, string>>('parish-users-db', {});

    const login = (username: string, pass: string): boolean => {
        if (users[username] && users[username] === pass) {
            setUser({ username });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const signup = (username: string, pass: string): boolean => {
        if (users[username]) {
            return false; // User already exists
        }
        setUsers({ ...users, [username]: pass });
        setUser({ username });
        return true;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
