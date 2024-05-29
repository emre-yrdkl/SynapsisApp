import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Image  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect, useCallback} from 'react';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../items/Notification';
import * as Progress from 'react-native-progress';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';
import NameOtherSvg from '../svg/nameOtherPages';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';


const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

const api_key = "bd11fa2ede77feb1dde0bdc20ea88bf5"


export default function Profile(){

    const { user, socket, receiveMessage } = useAuth();
    const [key, setKey] = useState(0); // Add a key state
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(true)

    const [loadingImage, setLoadingImage] = useState(false)


    const [editTrigger, setEditTrigger] = useState(false)
    const [editName, setEditName] = useState("")
    const [editImageUrl, setEditImageUrl] = useState("")
    const [editInterests, setEditInterests] = useState([])
    const [editBio, setEditBio] = useState("")
    const [editDate, setEditDate] = useState(new Date())

    const interests = [
        'Running', 'Soccer', 'Art', 'Make-up', 'Photography', 'Singing',
        'Concert', 'Theater', 'Bars', 'Video games', 'Cooking', 'Drama',
        'Comedy', 'Fantasy', 'Anime', 'Manga', 'Mystery',
    ]

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
            console.log("data.user",data.user)
            setUserInfo(data.user)
		} else {
			AlertDialog("Error",data.error)
		}
	}

    const onClickEdit = () => {
        setEditName(userInfo.preferences.name)
        setEditBio(userInfo.preferences.bio)
        setEditInterests(userInfo.preferences.interests)
        setEditImageUrl(userInfo.preferences.imageUrl)
        setEditDate(new Date(userInfo.preferences.date))
        setEditTrigger(true)
    }

    const acceptEdit = async () => {
        const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/savePreferences', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              "userId":user.userId,
              "preferences":{
                "userId":user.userId,
                "name":editName,
                "interests":editInterests,
                "bio":editBio,
                "date": editDate,
                "imageUrl": editImageUrl,
                "gender":userInfo.preferences.gender,
              }
          })  
        })
        if(response.status == 200){
            getUserInfo()
            setEditTrigger(false)
          }else{
            console.log("error:",response.status)
          }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 1,
        });
    
        if(result.canceled){
          return;
        }
        let formData = new FormData();
        formData.append("image",
                {
                    uri: result.assets[0].uri,
                    type: "image/jpeg",
                    name: 'image.jpg',
                });
    
        try {
            setLoadingImage(true)
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${api_key}`, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
          });

          setLoadingImage(false)
          if(response.status == 200){
            setEditImageUrl(response.data.data.display_url);
          }
          else{
            console.log("error:",response.status)
          }
    
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image. Please try again.');
        }
      };

    const isInterestSelected = (interest) => {
        return editInterests.includes(interest);
    };

    const toggleInterest = (interest) => {
        const index = editInterests.indexOf(interest);
        if (index !== -1) {
            setEditInterests(prevSelectedInterests =>
                prevSelectedInterests.filter(item => item !== interest)
            );
        } else {
            setEditInterests(prevSelectedInterests => [
                ...prevSelectedInterests,
                interest
            ]);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || editDate; // Backup to current date if the user cancels
        setEditDate(currentDate);
      };

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
        {editTrigger || userInfo.preferences && (
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
                                        <TouchableOpacity style={styles.button} onPress={onClickEdit}>
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

        {
            editTrigger &&
            (
            <View style={styles.containerUserList}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{padding:20}}>
                        <View style={{flexDirection:"row", marginTop:10}}>
                            {
                                loadingImage &&
                                <View style={styles.imageViewEditTemp}>
                                    <Image source={require('../assets/gifs/loading.gif')} style={{width:100, height:100}}/>
                                </View>
                            }
                            {
                                !loadingImage &&
                                <TouchableOpacity style={styles.imageViewEdit} onPress={pickImage}>
                                    <Image
                                        source={{ uri: editImageUrl }}
                                        style={styles.imageEdit}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.editImageView}>
                                        <Text style={styles.editImageText}>Edit</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            <View style={styles.informationView}>
                                <TextInput
                                    style = {styles.editName}
                                    value={editName}
                                    placeholder="Name"
                                    onChangeText={setEditName}
                                />
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={editDate}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeDate}
                                    style={{marginTop: verticalScale(20)}}
                                />

                                { /*<View style={styles.dateGenderView}>
                                    <Text style={styles.dateText}>{calculateAge(userInfo.preferences.date)}</Text>
                                    {
                                        userInfo.preferences.gender == "Prefer not to say" ?
                                        <Text style={{fontSize:22, marginRight:10}}></Text>
                                        :
                                        <Text style={{fontSize:22, marginRight:10, fontWeight:"500", fontFamily:"ArialRoundedMTBold",}}>{userInfo.preferences.gender}</Text>
                                    }    
                                </View>*/}
                                <View style={styles.buttonViewEdit}>
                                    <View style={{flex:3, justifyContent: 'flex-end', marginRight:8}}>
                                        <TouchableOpacity style={styles.buttonAccept} onPress={acceptEdit}>
                                            <Text style={styles.buttonText}>Accept</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex:1, justifyContent: 'flex-end',}}>
                                        <TouchableOpacity style={styles.buttonX} onPress={()=>setEditTrigger(false)}>
                                            <Text style={styles.buttonText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop:verticalScale(50)}}>
                            <Text style={{fontSize:25, fontFamily:"ArialRoundedMTBold",}}>Your Interest</Text>
                            <View style={styles.interestsContainer}>
                            {interests.map((interest) => (
                                <TouchableOpacity
                                    key={interest}
                                    style={[
                                        styles.interest,
                                        isInterestSelected(interest) ? styles.interestSelected : styles.interestNotSelected,
                                    ]}
                                    onPress={() => toggleInterest(interest)}
                                >
                                    <Text style={isInterestSelected(interest) ? styles.interestText : styles.interestNotText}>{interest}</Text>
                                </TouchableOpacity>
                            ))}

                            </View>
                        </View>
                        <View style={{marginTop:verticalScale(50)}}>
                            <Text style={{fontSize:25, fontFamily:"ArialRoundedMTBold",}}>Your Bio</Text>
                            <View style={{marginTop:verticalScale(20)}}>
                            <TextInput
                                style={{fontSize:17, fontFamily:"ArialRoundedMTBold", borderBottomWidth: 1,}}
                                value={editBio}
                                multiline={true}
                                onChangeText={setEditBio}
                                placeholder='Enter your bio here'
                                numberOfLines={3}
                            />
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </View>
            )
        }

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
    button:{
        marginTop: verticalScale(30), 
        marginBottom:verticalScale(15) ,
        backgroundColor: "#4F9DFF", 
        padding: 10, 
        borderRadius: 10
    },
    buttonAccept:{
        marginTop: verticalScale(30), 
        marginBottom:verticalScale(15) ,
        backgroundColor: "#3CCC7A", 
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