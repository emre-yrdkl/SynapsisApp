// AuthContext.js
import React, { createContext, useState, useContext  } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signIn = (token, userInfo) => {
        AsyncStorage.setItem('token', token)//local storage'da token tutuluyor
        setUser({ token, ...userInfo });
      };

    const signOut = () => {
        setUser(null);
        AsyncStorage.removeItem('token')
    };

    return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
