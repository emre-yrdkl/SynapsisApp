import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../items/Notification';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';
import NameOtherSvg from '../svg/nameOtherPages';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MessageBox from '../svg/messageBox';
import { useNavigation } from '@react-navigation/native';


const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

const data = [
    { id: '1', title: 'Emre Y.' },
    { id: '2', title: 'Egemen C.' },
    { id: '3', title: 'Abdülre T.' },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
    { id: '6', title: 'Item 6' },
    { id: '7', title: 'Item 6' },
    { id: '8', title: 'Item 6' },
    { id: '9', title: 'Item 6' },
    { id: '10', title: 'Item 6' },
    { id: '11', title: 'Item 6' },
    { id: '12', title: 'Item 6' },
    { id: '13', title: 'Item 6' },
    { id: '14', title: 'Item 6' },
    { id: '15', title: 'Item 6' },
    { id: '16', title: 'Item 6' },
    { id: '17', title: 'Item 6' },
    { id: '18', title: 'Item 6' },


  ];

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
            <View style={styles.nameContainerTall}>
              <NameOtherSvg/>
            </View>
            :
            <View style={styles.nameContainerShort}>
              <NameOtherSvg/>
            </View>
            }

            <View style={styles.storyView}>
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
                    
            </View>

            <View style={styles.activePeopleView}>
                    <Text style={styles.activePeopleText}>
                        Active People
                    </Text>
            </View>

            <View style={styles.listView}>
                <FlatList
                    data={receiveUserList}
                    keyExtractor={item => item.userId}
                    contentContainerStyle={styles.list}
                    numColumns={3}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={{width:"100%", height:145 , borderWidth:2, borderRadius:8, backgroundColor:"#FF9F1C46", borderColor:"#FF9F1C"}}>
                            </View>
                            <View style={styles.itemCardView}>
                                <View style={styles.itemCardTextView}>
                                    <Text style={styles.ItemCardText}>{item.userName}</Text>
                                </View> 

                                <View style={styles.itemCardButtonView}>
                                    <TouchableOpacity onPress={()=>{navigation.navigate('Chat', { user1:user, user2:{senderId:item.userId, senderName:item.userName}})}}>
                                        <MessageBox />
                                    </TouchableOpacity>
                                </View>
                            </View> 
                             
                            
                        </View>
                    )}
                />
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
        margin:verticalScale(30),
    },
    nameContainerTall:{
        alignSelf: 'center',
        margin:verticalScale(50),
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
        height:350
    },
    item:{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal:5,
        marginVertical:10,
    },
    itemCardView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Vertical center alignment
        marginTop:verticalScale(10),
        paddingHorizontal:5
    },
    itemCardTextView:{
        flex: 1,
    },
    ItemCardText:{
        textAlign: 'left',
    },
    itemCardButtonView:{
        alignItems: 'flex-end',
        marginLeft:5
    }
});