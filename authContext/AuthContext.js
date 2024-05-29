// AuthContext.js
import React, { createContext, useState, useContext, useEffect  } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState({})
    const [checkInPlace, setCheckInPlace] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [receiveUserList, setReceiveUserList] = useState([])
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      console.log("newSocket")
      // Initialize socket connection only once when component mounts
      const newSocket = io.connect("https://test-socket-ffe88ccac614.herokuapp.com");
      setSocket(newSocket);

      // Clean up function to close the socket connection when component unmounts
      return () => {
          newSocket.disconnect();
      };
    }, []);

    useEffect(() => {
      if (socket) {
        socket.on("receive_message", (data) => {
            setReceiveMessage(data);
            console.log("messageData1", data);
        });

        socket.on("placeUsers", (data) => {
            setReceiveUserList(data);
            console.log("users SOCKET: ", data);
        });
      }
    }, [socket]);

    const signIn = (token, userInfo) => {
      
        console.log("Ağğğğ",userInfo)
        AsyncStorage.setItem('token', token)//local storage'da token tutuluyor
        setUser(current => ({ ...current, token, ...userInfo }));
        console.log("loooooo", user)
      };
    
    const setLocation = (latitude, longitude) => {
      setUser(current => ({ ...current, latitude, longitude }));
      
    };

    const setPreferences = (preferences) => {
      setUser(current => ({ ...current, preferences }));
      
    };

    const signOut = () => {
        setUser(null);
        AsyncStorage.removeItem('token')
    };

    return (
    <AuthContext.Provider value={{ user, signIn, signOut, socket, receiveMessage, 
    setLocation, setPreferences, setCheckInPlace, checkInPlace, setRoomId, roomId, receiveUserList }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
