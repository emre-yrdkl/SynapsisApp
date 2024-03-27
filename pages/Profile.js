import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../items/Notification';


const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

export default function Profile(){

    const { user, socket, receiveMessage } = useAuth();
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [key, setKey] = useState(0); // Add a key state
    
    async function getUserInfo() {
		const res = await fetch('http://localhost:1338/api/quote', {
			headers: {
				'x-access-token': await AsyncStorage.getItem('token'),
			},
		})

		const data = await res.json()
		if (data.status === 'ok') {
            setName(data.name)
            setEmail(data.email)
			//setBinancekey(data.Binancekey)
		} else {
			AlertDialog("Error",data.error)
		}
	}

    useEffect(()=>{
        console.log("receiveMessage",receiveMessage)
        showNotification()
    },[receiveMessage])

    const showNotification = () => {
    // Update the message with a unique key every time
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
    };
    

    useEffect(()=>{
        getUserInfo()
    },[])

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.profileTitle}>
                    Profile
                </Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>
                        {name}
                    </Text>
                </View>
                <View style={styles.emailContainer}>
                    <Text style={styles.emailText}>
                        {email}
                    </Text>
                </View>

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
        width:90,
        paddingBottom:5

    },
    profileTitle:{
        fontSize:30,
        color:"#F6F4EB"
    },
    infoContainer:{
        marginHorizontal:25,
    },
    nameContainer:{
        marginVertical:20,
        width:200,
        borderColor:"#F6F4EB",
        borderRadius:10,
        borderWidth:2,
        paddingVertical:7,
        paddingLeft:4,
        
    },
    emailContainer:{
        marginVertical:20,
        width:200,
        borderColor:"#F6F4EB",
        borderRadius:10,
        borderWidth:2,
        paddingVertical:7,
        paddingLeft:4,
    },
    nameText:{
        color:"#F6F4EB",
        fontSize:14
    },
    emailText:{
        color:"#F6F4EB",
        fontSize:14
    }
});