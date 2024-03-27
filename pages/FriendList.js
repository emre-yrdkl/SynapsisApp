import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../items/Notification';

const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

export default function FriendList(){

    const { user, socket, receiveMessage } = useAuth();
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [key, setKey] = useState(0); // Add a key state

    async function getAllUsers() {
		const res = await fetch('http://localhost:1338/api/getUsers')

		const data = await res.json()
        console.log("data: ",data)
		if (data.status === 'ok') {
			//setBinancekey(data.Binancekey)
		} else {
			AlertDialog("Error",data.error)
		}
	}

    useEffect(()=>{
        getAllUsers()
    },[])

    useEffect(()=>{
        console.log("receiveMessage",receiveMessage)
        showNotification()
    },[receiveMessage])

    const showNotification = () => {
    // Update the message with a unique key every time
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
    };

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.profileTitle}>
                    Friend List
                </Text>
            </View>
            <Notification key={key} message={receiveMessage} />

        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#a6c1ce',
    },
    titleContainer:{
        borderBottomColor: '#F6F4EB',
        borderBottomWidth: 2,
        marginHorizontal:25,
        marginVertical:20,
        width:150,
        paddingBottom:5

    },
    profileTitle:{
        fontSize:30,
        color:"#F6F4EB"
    },
});