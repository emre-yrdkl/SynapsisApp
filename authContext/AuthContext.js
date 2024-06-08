// AuthContext.js
import React, { createContext, useState, useContext, useEffect  } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState("")
    const [receiveMessage, setReceiveMessage] = useState({})
    const [checkInPlace, setCheckInPlace] = useState(false);
    const [placeName, setPlaceName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [receiveUserList, setReceiveUserList] = useState([])
    const [socket, setSocket] = useState(null);
    const [placeExistOrNot, setPlaceExistOrNot] = useState("");

    const [displayedMessages, setDisplayedMessages] = useState("");

    const markMessageAsDisplayed = (messageId) => {
      setDisplayedMessages(messageId);
    }

    useEffect(() => {
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
        });

        socket.on("checkPlaceOrNot", async (data) => {
            
          console.log("placeExistOrNot SOCKET: ", data);
          setPlaceExistOrNot(data);
        });


        socket.on("placeUsers", async (data) => {

          const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/place/orderUsers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId":userId,
                "users":data
            })
          })
          const result = await response.json()

            setReceiveUserList(result);
        });
      }
    }, [socket, userId]);

    const signIn = (token, userInfo) => {
      
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
                                setLocation, setPreferences, setCheckInPlace, checkInPlace, 
                                setPlaceName, placeName ,setRoomId, roomId, receiveUserList,
                                setUserId, displayedMessages, markMessageAsDisplayed, placeExistOrNot }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
