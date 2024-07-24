import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };

    const updateUser = (updatedUser) => {
        axios.put('http://192.168.29.9:3001/api/profile/update', updatedUser)
            .then(response => {
                setUser(response.data);
                sessionStorage.setItem('user', JSON.stringify(response.data));
            })
            .catch(error => {
                console.error('Error updating user data:', error);
            });
    };

    const deleteUser = (email) => {
        axios.delete('http://192.168.29.9:3001/api/profile', { data: { email } })
            .then(response => {
                logout();
                console.log('Profile deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};