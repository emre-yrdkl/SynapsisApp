import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Image  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../items/Notification';
import * as Progress from 'react-native-progress';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';
import NameOtherSvg from '../svg/nameOtherPages';

const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

export default function Profile(){

    const { user, socket, receiveMessage } = useAuth();
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [key, setKey] = useState(0); // Add a key state
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(true)
    

    function calculateAge(birthDateString) {
        const birthDate = new Date(birthDateString);
      
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
      
        if (
          currentDate.getMonth() < birthDate.getMonth() ||
          (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate())
        ) {
          age--;
        }
      
        return age;
      }
    
    async function getUserInfo() {
		const userInform = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/getUserInfo', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId":user.userId,
            })  
        })

		const data = await userInform.json()

		if (userInform.status === 200) {
            setLoading(false)
            setUserInfo(data.user)
		} else {
			AlertDialog("Error",data.error)
		}
	}

    useEffect(()=>{
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
        {
        height > 700 ?
            <View style={styles.nameContainerTall}>
                <NameOtherSvg/>
            </View>
            :
            <View style={styles.nameContainerShort}>
                <NameOtherSvg/>
            </View>
        }

        <Text style={styles.title}>Your Profile</Text>

        {loading && 
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/gifs/loading.gif')} style={{width:250, height:250}}/>
            </View>
        }
        {userInfo.preferences && (
                <View style={styles.containerUserList}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{padding:20}}>
                            <View style={{flexDirection:"row", marginTop:10}}>
                                <View style={styles.imageView}>
                                    <Image
                                        source={{ uri: userInfo.preferences.imageUrl }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={styles.informationView}>
                                    <Text style={styles.nameText}>{userInfo.preferences.name + ", " + calculateAge(userInfo.preferences.date)}</Text>
                                    <View style={styles.dateGenderView}>
                                        { /*<Text style={styles.dateText}>{calculateAge(userInfo.preferences.date)}</Text>
                                        {
                                            userInfo.preferences.gender == "Prefer not to say" ?
                                            <Text style={{fontSize:22, marginRight:10}}></Text>
                                            :
                                            <Text style={{fontSize:22, marginRight:10, fontWeight:"500", fontFamily:"ArialRoundedMTBold",}}>{userInfo.preferences.gender}</Text>
                                        }    */}
                                    </View>
                                    <View style={styles.buttonView}>
                                        <TouchableOpacity style={styles.button}>
                                            <Text style={styles.buttonText}>Edit Profile</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{marginTop:verticalScale(50)}}>
                                <Text style={{fontSize:25, fontFamily:"ArialRoundedMTBold",}}>Your Interest</Text>
                                <View style={styles.interestsContainer}>
                                    {userInfo.preferences.interests.map((interest) => (
                                        <View
                                        key={interest}
                                        style={[
                                            styles.interest,
                                            styles.interestSelected,
                                        ]}
                                        >
                                        <Text style={styles.interestText}>{interest}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View style={{marginTop:verticalScale(50)}}>
                                <Text style={{fontSize:25, fontFamily:"ArialRoundedMTBold",}}>Your Bio</Text>
                                <View style={{marginTop:verticalScale(20)}}>
                                    <Text style={{fontSize:17, fontFamily:"ArialRoundedMTBold",}}>{userInfo.preferences.bio}</Text>
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </View>
        )}

        <Notification key={key} message={receiveMessage} />
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    },
    nameContainerShort:{
        position:"absolute",
        alignSelf: 'center',
        top: 0,
        margin:verticalScale(40),
        zIndex:5
      },
      nameContainerTall:{
        position:"absolute",
        alignSelf: 'center',
        top: 0,
        margin:verticalScale(50),
        zIndex:5
      },
      title:{
        color:"#E69400",
        fontFamily:"ArialRoundedMTBold",
        fontSize:35,
        fontWeight:400,
        marginTop:verticalScale(150),
        textAlign:"center",
      },
      containerUserList:{
        borderWidth:2,
        borderColor:"#E69400",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#F5F5F5',
        marginTop:8,
        height:height- verticalScale(240),
      },
      imageView:{
        borderRadius:10, 
        flex:2, 
        maxHeight: 170
      },
    image:{
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    informationView:{
        flex:3,
        marginLeft:15, 
        backgroundColor:"#E6940025", 
        borderRadius:10, 
        paddingHorizontal:10
    },
    nameText:{
        marginTop:verticalScale(15),
        fontSize:25, 
        fontWeight:"600", 
        fontFamily:"ArialRoundedMTBold",
    },
    dateGenderView:{
        flexDirection:"row", 
        justifyContent:'space-between', 
        marginTop:verticalScale(25)
    },
    dateText:{
        fontSize:22, 
        fontWeight:"500", 
        fontFamily:"ArialRoundedMTBold"
    },
    buttonView:{
        flex: 1, 
        justifyContent: 'flex-end'
    },
    button:{
        marginTop: verticalScale(30), 
        marginBottom:verticalScale(15) ,
        backgroundColor: "#4F9DFF", 
        padding: 10, 
        borderRadius: 10
    },
    buttonText:{
        fontSize:15, 
        color: "#F5F5F5", 
        textAlign: "center", 
        fontWeight:"500", 
        fontFamily:"ArialRoundedMTBold"
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: verticalScale(30),
      },
      interest: {
        paddingVertical: verticalScale(10),
        paddingHorizontal: horizontalScale(18),
        borderRadius: 10,
        margin: 5,
      },
      interestSelected: {
        borderColor: '#F5F5F5',
        backgroundColor: '#FFB366',
        borderWidth: 2,
        borderColor: '#FFB366',
      },
      interestText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
      },
});