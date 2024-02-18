import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';


const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

export default function FriendList(){
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")

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

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.profileTitle}>
                    Friend List
                </Text>
            </View>

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