import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Image  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../items/Notification';
import * as Progress from 'react-native-progress';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';
import NameOtherSvg from '../svg/nameOtherPages';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';

const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

const api_key = "bd11fa2ede77feb1dde0bdc20ea88bf5"


export default function OthersProfile(){

    const { user, socket, receiveMessage } = useAuth();
    const [key, setKey] = useState(0); // Add a key state
    const [userInfo, setUserInfo] = useState({})
    const [FriendRequestStatus, setFriendRequestStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [friendshipId, setFriendshipId] = useState("")
    const route = useRoute();

    const {searcherId, searchedId} = route.params;

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
		const userInform = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/searchProfile', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "searcherUserId":searcherId,
                "searchedUserId":searchedId,
            })
        })

		const data = await userInform.json()
        console.log("others profile", data)
		if (userInform.status === 200) {
            setFriendshipId(data.friendshipId)
            setUserInfo(data.userInfo)
            console.log("setFriendRequestStatus",data.status)
            setFriendRequestStatus(data.status)
            setLoading(false)
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

    const addToFriend = async () => {
        
        const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/addFriend', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "senderUserId":searcherId,
                "receiverUserId": searchedId,
            })
        })

		const data = await response.json()

		if (response.status === 200 && data.message === "Success") {
            setFriendRequestStatus("pending")
		} else {
			AlertDialog("Error",data.error)
		}
    }

    const approveFriend = async () => {

        console.log("approveFriend",{
            "senderUserId":searchedId,
            "receiverUserId": searcherId,
            "friendshipId": friendshipId,
            "evaluation":true
        })
            
        const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/approveRejectFriend', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "senderUserId":searchedId,
                "receiverUserId": searcherId,
                "friendshipId": friendshipId,
                "evaluation":true
            })
        })

        const data = await response.json()

        if (response.status === 200 && data.friendshipUpdated.status === "confirmed") {
            setFriendRequestStatus("confirmed")
        }  else { 
            AlertDialog("Error",data.error)
        }
    }

    const rejectFriend = async () => {
            
        const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/approveRejectFriend', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "senderUserId":searchedId,
                "receiverUserId": searcherId,
                "friendshipId": friendshipId,
                "evaluation":false
            })
        })

        const data = await response.json()

        console.log("rejectFriend",data)

        if (response.status === 200 && data === "friendship deleted") {
            setFriendRequestStatus("No relation")
        }  else { 
            AlertDialog("Error",data.error)
        }
    }

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

        

        {loading && 
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/gifs/loading.gif')} style={{width:250, height:250}}/>
            </View>
        }

        {userInfo.preferences && (
            <>
                <Text style={styles.title}>{userInfo.preferences.name }'s Profile</Text>
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
                                        {   
                                            FriendRequestStatus == "confirmed" ? (
                                                <View style={styles.buttonConfirm}>
                                                    <Text style={styles.buttonText}>Your Friend</Text>
                                                </View>
                                                ) : FriendRequestStatus == "pending" ? (
                                                <View style={styles.buttonPending}>
                                                    <Text style={styles.buttonText}>Pending</Text>
                                                </View>
                                                ) : FriendRequestStatus == "onApprovement" ? (
                                                    <View style={{flexDirection:"row"}}>
                                                        <View style={{flex:1, marginRight:6}}>
                                                            <TouchableOpacity style={styles.buttonAccept} onPress={approveFriend}>
                                                                <Text style={styles.buttonText}>Accept</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{flex:1, marginLeft:6}}>
                                                            <TouchableOpacity style={styles.buttonReject} onPress={rejectFriend}>
                                                                <Text style={styles.buttonText}>Reject</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ) 
                                                : FriendRequestStatus == "No relation" ? (
                                                <TouchableOpacity style={styles.buttonAddFriend} onPress={addToFriend}>
                                                    <Text style={styles.buttonText}>Add to Friend</Text>
                                                </TouchableOpacity>) : null
                                            
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={{marginTop:verticalScale(50)}}>
                                <Text style={{fontSize:25, fontFamily:"ArialRoundedMTBold",}}>{userInfo.preferences.name}'s Interest</Text>
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
                                <Text style={{fontSize:25, fontFamily:"ArialRoundedMTBold",}}>{userInfo.preferences.name}'s Bio</Text>
                                <View style={{marginTop:verticalScale(20)}}>
                                    <Text style={{fontSize:17, fontFamily:"ArialRoundedMTBold",}}>{userInfo.preferences.bio}</Text>
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </View>
            </>
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
        marginTop:verticalScale(100),
        textAlign:"center",
      },
      containerUserList:{
        borderWidth:2,
        borderColor:"#E69400",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#F5F5F5',
        marginTop:8,
        height:height- verticalScale(200),
      },
      imageView:{
        borderRadius:10, 
        flex:2, 
        maxHeight: 170
      },
      imageViewEdit:{
        position: 'relative',
        borderRadius: 10,
        flex: 2,
        maxHeight: 170,
        
      },
      imageViewEditTemp:{
        position: 'relative',
        borderRadius: 10,
        flex: 2,
        maxHeight: 170,
        justifyContent: 'center', 
        alignItems: 'center'
      },
    image:{
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    imageEdit:{
        width: '100%',
        height: '100%',
        borderRadius: 10,
        opacity: 0.5,
    },
    informationView:{
        flex:3,
        marginLeft:15, 
        backgroundColor:"#E6940025", 
        borderRadius:10, 
        paddingHorizontal:10,
        alignItems: 'center',
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
        justifyContent: 'flex-end',
        width: '100%',
    },
    buttonViewEdit:{
        flex: 1, 
        justifyContent: 'flex-end',
        flexDirection:"row",
        width: '100%',
    },
    buttonAddFriend:{
        marginTop: verticalScale(30), 
        marginBottom:verticalScale(15) ,
        backgroundColor: "#6699FF", 
        padding: 10, 
        borderRadius: 10
    },
    buttonReject:{
        marginTop: verticalScale(30), 
        marginBottom:verticalScale(15) ,
        backgroundColor: "#FFABAB", 
        padding: 10, 
        borderRadius: 10
    },
    buttonPending:{
        marginTop: verticalScale(30), 
        marginBottom:verticalScale(15) ,
        backgroundColor: "#FFD18C", 
        padding: 10, 
        borderRadius: 10
    },
    buttonConfirm:{
        marginTop: verticalScale(30), 
        marginBottom:verticalScale(15) ,
        backgroundColor: "#4F9DFF", 
        padding: 10, 
        borderRadius: 10
    },
    buttonAccept:{
        marginTop: verticalScale(30), 
        marginBottom:verticalScale(15) ,
        backgroundColor: "#66FF99", 
        padding: 10, 
        borderRadius: 10,
    },
    buttonX:{
        marginTop: verticalScale(30), 
        marginBottom:verticalScale(15) ,
        backgroundColor: "#FFABAB", 
        padding: 10, 
        borderRadius: 10,
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
      interestNotSelected:{
        borderWidth: 2,
        borderColor: '#FFB366',
        backgroundColor: '#F5F5F5',
    
      },
      interestText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
      },
      interestNotText: {
        color: '#FFB366',
        textAlign: 'center',
        fontSize: 16,
      },
      editName: {
        marginTop:verticalScale(15),
        fontSize:25, 
        fontWeight:"600", 
        fontFamily:"ArialRoundedMTBold",
        borderBottomWidth: 1,
      },
      editImageView: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editImageText: {
        fontSize: 24,
        color: '#000', // Adjust color as needed
        paddingHorizontal:4,
        paddingVertical:2,
        borderWidth: 2,
        borderRadius: 10,

    },
});