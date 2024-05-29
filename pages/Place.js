import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../items/Notification';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';
import NameOtherSvg from '../svg/nameOtherPages';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MessageBox from '../svg/messageBox';
import LeaveArrow from '../svg/leaveArrow';
import { useNavigation } from '@react-navigation/native';


const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

export default function Place(){

    const { user, socket, receiveMessage, setCheckInPlace, roomId, receiveUserList } = useAuth();
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [key, setKey] = useState(0); // Add a key state
    
    const navigation = useNavigation();


    useEffect(()=>{
        console.log("receiveUserList",receiveUserList)

        console.log("receiveMessage",receiveMessage)
        showNotification()
    },[receiveMessage])

    const leavePlace = () =>{
        socket.emit("leavePlace",{placeId:roomId})
        setCheckInPlace(false)
    }


    const showNotification = () => {
    // Update the message with a unique key every time
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
    };
    

    return(
        <View style={styles.container}>
            
            {
            height > 700 ?
            <>
                <TouchableOpacity style={{borderWidth:2, marginTop:24}} onPress={leavePlace}>
                        <Text>
                            Leave
                        </Text>
                </TouchableOpacity>
                {/*style={styles.leaveButtonTall}<View style={styles.nameContainerTall}>
                <NameOtherSvg/>
            </View>*/}
            </>

            :
            <>
                <TouchableOpacity style={styles.leaveButtonShort} onPress={leavePlace}>
                    <LeaveArrow />
                        <Text style={styles.leaveText}>
                            Leave
                        </Text>
                </TouchableOpacity>
                <View style={styles.nameContainerShort}>
                <NameOtherSvg/>
                </View>
            </>
            }

            {/*<View style={styles.storyView}>
                <View style={{marginVertical:13, marginHorizontal:5, flexDirection:"row"}}>
                    
                    <View style={{width:60, height:60, backgroundColor:"#FF6F61", borderRadius:30, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize:30, color:"#fff", fontWeight:"600"}}>
                            +
                        </Text>
                    </View>

                    <View style={{width:62, height:62, marginLeft:15, backgroundColor:"#36454F", borderWidth:4, borderRadius:40, borderColor: "#FF6F61",
                    justifyContent: 'center', alignItems: 'center'}}>
                    </View>

                    <View style={{width:62, height:62, marginLeft:15, backgroundColor:"#36454F", borderWidth:4, borderRadius:40, borderColor: "#FF6F61",
                    justifyContent: 'center', alignItems: 'center'}}>
                    </View>

                    <View style={{width:62, height:62, marginLeft:15, backgroundColor:"#36454F", borderWidth:4, borderRadius:40, borderColor: "#FF6F61",
                    justifyContent: 'center', alignItems: 'center'}}>
                    </View>

                    <View style={{width:62, height:62, marginLeft:15, backgroundColor:"#36454F", borderWidth:4, borderRadius:40, borderColor: "#FF6F61",
                    justifyContent: 'center', alignItems: 'center'}}>
                    </View>

                    <View style={{position:"relative", zIndex:5}}>
                        <MaterialCommunityIcons 
                        name="arrow-right"
                        size={28} 
                        color="#aaa"
                    /> 
                    </View>
                </View>
                    
            </View>*/}

            <View style={styles.activePeopleView}>
                    <Text style={styles.activePeopleText}>
                        Active People
                    </Text>
            </View>

            <View style={styles.listView}>

            {receiveUserList.length > 0 &&
                <FlatList
                    data={receiveUserList.filter((item) => item.userId !== user.userId)}
                    keyExtractor={item => item.userId}
                    numColumns={3}
                    style={{paddingHorizontal: 5}}
                    renderItem={({ item }) => (
                        console.log("itememre",item), // Add a comma here
                        <TouchableOpacity style={styles.item} onPress={()=>{navigation.navigate('OthersProfile', { searcherId:user.userId, searchedId:item.userId, friendshipId:item.friendshipId})}}>
                        <Image source={{ uri: item.preferences.imageUrl }} style={styles.image} resizeMode="cover"/>
                        {/*<View style={{ width: "100%", height: 145, borderWidth: 2, borderRadius: 8, backgroundColor: "#FF9F1C46", borderColor: "#FF9F1C" }}>
                        </View>*/}
                        <View style={styles.itemCardView}>
                        <View style={styles.itemCardTextView}>
                            <Text style={styles.ItemCardText}>{item.preferences.name}</Text>
                        </View>

                        <View style={styles.itemCardButtonView}>
                            <TouchableOpacity onPress={() => { console.log("click") }}>
                            <MessageBox />
                            </TouchableOpacity>
                        </View>
                        </View>
                    </TouchableOpacity>
                    )}
                />
            }
            </View>

{/*
            <View>
            {
                receiveUserList.map((data)=>{
                    return  <Text>
                                {data.userName}
                            </Text>
                })
            }
        </View>
        <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
                <TouchableOpacity onPress={leavePlace}>
                    <Text>
                        Leave
                    </Text>
                </TouchableOpacity>
            </View>
        </View> 
        
        */
}

            <Notification key={key} message={receiveMessage} />
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
    },
    nameContainerShort:{
        alignSelf: 'center',
        margin:verticalScale(40),
    },
    nameContainerTall:{
        position:"absolute",
        marginHorizontal:verticalScale(20),
        marginVertical:verticalScale(50),
        paddingHorizontal:6,
        paddingVertical:6,
        borderRadius:10,
        backgroundColor:"#FF6F61",
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    leaveButtonShort:{
        position:"absolute",
        marginHorizontal:verticalScale(10),
        marginVertical:verticalScale(30),
        paddingHorizontal:6,
        paddingVertical:6,
        borderRadius:10,
        backgroundColor:"#FF6F61",
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    leaveButtonTall:{
        position:"absolute",
        margin:verticalScale(50),
        padding:3,
        borderWidth:2
    },
    leaveText:{
        fontSize:moderateScale(20),
        marginLeft:5,
        fontFamily: 'ArialRoundedMTBold',
        color:"#fefefe"
    },
    storyView:{
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor:"#FF9F1C66"
    },
    activePeopleText:{
        fontSize:moderateScale(30),
        fontFamily:"ArialRoundedMTBold",
        fontWeight:"600",
        color:"#FF6F61",
        textAlign:"center"
    },
    activePeopleView:{
        marginTop:verticalScale(40)
    },
    listView:{
        width:"100%",
        borderWidth:2,
        borderColor:"#FF9F1C",
        marginTop:verticalScale(20),
        paddingHorizontal:verticalScale(5),
        paddingVertical:verticalScale(10),
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        height:400
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 10,
        maxWidth: (width - 34) / 3
      },
      itemCardView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Vertical center alignment
        marginTop: 10,
        paddingHorizontal: 5
      },
      itemCardTextView: {
        flex: 1,
      },
      ItemCardText: {
        textAlign: 'left',
      },
      itemCardButtonView: {
        alignItems: 'flex-end',
        marginLeft: 5
      },
      image: {
        width: "100%", 
        height: 145,
        borderRadius: 10,
      },
});