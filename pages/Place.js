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
import GoBackSvgWhite from '../svg/goBackWhite';
import GoBackSvgWhiteSmall from '../svg/goBackWhiteSmall';


const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

export default function Place(){

    const navigation = useNavigation();
    const { user, socket, receiveMessage, setCheckInPlace, placeName ,roomId, receiveUserList, displayedMessages } = useAuth();

    const [currentMessage, setCurrentMessage] = useState({});

    useEffect(() => {
        if (receiveMessage && displayedMessages !== receiveMessage.content+receiveMessage.dmId) {
        setCurrentMessage(receiveMessage);
        }
    }, [receiveMessage, displayedMessages]);

    const leavePlace = () =>{
        socket.emit("leavePlace",{placeId:roomId})
        setCheckInPlace(false)
    }

    return(
        <View style={styles.container}>
            
            {
            height > 700 ?
            <>
                <TouchableOpacity style={styles.leaveButtonTall} onPress={leavePlace}>
                        <GoBackSvgWhiteSmall />
                        <Text style={styles.leaveText}>
                            Leave
                        </Text>
                </TouchableOpacity>
                <View style={styles.nameContainerTall}>
                    <NameOtherSvg/>
                </View>
            </>

            :
            <>
                <TouchableOpacity style={styles.leaveButtonShort} onPress={leavePlace}>
                    <GoBackSvgWhiteSmall />

                    <Text style={styles.leaveText}>
                        Leave
                    </Text>
                </TouchableOpacity>
                <View style={styles.nameContainerShort}>
                <NameOtherSvg/>
                </View>
            </>
            }

            <Text style={styles.placeText}>
                {placeName}
            </Text>

            <View style={styles.listView}>
                {
                    receiveUserList.length == 1 &&
                    <Text style={{textAlign:"center", marginTop:10, fontFamily: 'ArialRoundedMTBold', 
                                    fontSize: 20, color:"#E69400"}}>
                        No one is here
                    </Text>
                }

            {receiveUserList.length > 1 &&
            
                <FlatList
                    data={receiveUserList.filter((item) => item.userId !== user.userId)}
                    keyExtractor={item => item.userId}
                    numColumns={3}
                    style={{paddingHorizontal: 5}}
                    renderItem={({ item }) => (
                        console.log("iteeeem",item),
                        <TouchableOpacity style={styles.item} onPress={()=>{navigation.navigate('OthersProfile', { searcherId:user.userId, searchedId:item.userId, friendshipId:item.friendshipId})}}>
                        <Image source={{ uri: item.preferences?.imageUrl }} style={styles.image} resizeMode="cover"/>
                        {/*<View style={{ width: "100%", height: 145, borderWidth: 2, borderRadius: 8, backgroundColor: "#FF9F1C46", borderColor: "#FF9F1C" }}>
                        </View>*/}
                        <View style={styles.itemCardView}>
                        <View style={styles.itemCardTextView}>
                            <Text style={styles.ItemCardText}>{item.preferences?.name}</Text>
                        </View>

                        </View>
                    </TouchableOpacity>
                    )}
                />
            }
            </View>

            <Notification message={currentMessage} />
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
    leaveButtonShort:{
        position:"absolute",
        marginHorizontal:verticalScale(10),
        marginVertical:verticalScale(40),
        paddingHorizontal:4,
        paddingVertical:4,
        borderRadius:10,
        backgroundColor:"#FF9F1C",
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    leaveButtonTall:{
        position:"absolute",
        marginHorizontal:verticalScale(10),
        marginVertical:verticalScale(50),
        paddingHorizontal:4,
        paddingVertical:4,
        borderRadius:10,
        backgroundColor:"#FF9F1C",
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    leaveText:{
        fontSize:moderateScale(20),
        marginLeft:8,
        fontFamily: 'ArialRoundedMTBold',
        color:"#fefefe"
    },
    storyView:{
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor:"#FF9F1C66"
    },
    placeText:{
        color:"#FF6F61",
        fontFamily:"ArialRoundedMTBold",
        fontSize:30,
        marginTop:verticalScale(120),
        textAlign:"center",
    },
    listView:{
        borderWidth:2,
        borderColor:"#FF9F1C",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#fff5e8',
        marginTop:8,
        height:height - verticalScale(225),
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
        flex:1,
        flexDirection: 'row',
        alignItems: 'center', // Vertical center alignment
        marginTop: 10,
      },
      itemCardTextView: {
        flex: 1,
      },
      ItemCardText: {
        textAlign: 'left',
        fontSize: 16,
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