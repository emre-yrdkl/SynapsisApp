import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';
import { useAuth } from '../authContext/AuthContext';
import { useNavigation } from '@react-navigation/native';
import NameOtherSvg from '../svg/nameOtherPages';
import SearchSvg from '../svg/search';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';

const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

const TimeDisplay = (time) => {
  // Create a Date object
  const date = new Date(time);

  // Get the hours and minutes
  const hours = date.getUTCHours() + 3; // Use getHours() if the timestamp is in local time
  const minutes = date.getUTCMinutes(); // Use getMinutes() if the timestamp is in local time

  // Format hours and minutes to always show two digits
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Combine hours and minutes
  const formattedTime = `${formattedHours}:${formattedMinutes}`;

  return formattedTime

}

export default function DirectMessage(){
    const { user, receiveMessage } = useAuth();
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [allUsers,setAllUsers] = useState([])
    const [usersInfo, setUsersInfo] = useState([])
    const [dms,setDms] = useState([])
    const navigation = useNavigation();


    useEffect( ()=>{


      fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/users', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }).then(async (response)=>{

            if(response.status ==200){

              const result2 = await response.json()
              console.log("RESULT: ",result2)
              setAllUsers(result2.userList)



              fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/dm/getDms', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "userId":user.userId,            
                })
              }).then(async (res)=>{
                if(res.status == 200){
                  const result = await res.json()
                  console.log("RESULT get dms: ",result)
                  setDms(result.dmList)

                  let TempDmList = result.dmList

                  TempDmList.forEach((element,index) => {
                    //console.log("hahah",result.userList)
                    element.users.forEach(elm =>{

                        if(elm != user.userId){

                            result2.userList.forEach((data)=>{
                              if(data._id == elm){
                                TempDmList[index].senderName = data.preferences.name
                                TempDmList[index].senderId = data._id
                                TempDmList[index].imageUrl = data.preferences.imageUrl

                            }
                            })
                        }
                    })
                  })
                  console.log("TempDmList",TempDmList)
                  setUsersInfo(TempDmList)

                }
                else{
                  throw res.status
                }
              })



            }

          })



    },[receiveMessage])

    return(
        <View>
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

          <Text style={styles.title}>Messages</Text>

          <View style={styles.containerSearch}>
            <View style={styles.searchInputView}>
                <TextInput style={styles.searchInput} placeholder={'Search...'} placeholderTextColor="rgba(255, 159, 28, 0.50)" />
                <SearchSvg style={styles.searchSvg}/>
            </View>
          </View>

          <View style={styles.containerUserList}>
            <View style={{padding:5, height:"100%"}}>
                  <FlatList
                    data={usersInfo}
                    numColumns={2}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      console.log("item34", usersInfo),
                      <TouchableOpacity style={styles.listItem} onPress={()=>{navigation.navigate('Chat', { user1:{userId:user.userId, userName:user.preferences.name}, user2:item})}}>
                        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover"/>
                        <View style={{width:"80%"}}>
                          <View style={{ flexDirection:"row", marginBottom:8, justifyContent: 'space-between'}}>
                              <Text style={{fontFamily: 'ArialRoundedMTBold', fontSize: 15, fontWeight: '400'}}>
                                {item.senderName}
                              </Text>
                              <Text style={{textAlign: 'right', fontFamily: 'ArialRoundedMTBold', 
                                            fontSize: 13, fontWeight: '100'}}>
                                {TimeDisplay(item.latestMessageDate)}
                              </Text>
                          </View>
                          <Text style={{fontFamily: 'ArialRoundedMTBold', fontSize: 12, fontWeight: '300'}}>
                          {item.latestMessage}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
            </View>
          </View>
        </View>
    )    
}

const styles = StyleSheet.create({
  nameContainer:{
    alignSelf: 'center',
    marginTop:42
  },
  title:{
    color:"#FF6F61",
    fontFamily:"ArialRoundedMTBold",
    fontSize:35,
    marginTop:verticalScale(130),
    textAlign:"center",
  },
  containerSearch:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:16
  },
  searchInputView:{
    borderWidth:2,
    borderColor:"#E69400",
    borderRadius:10,
    paddingVertical:5,
    width:"90%",
    flexDirection: 'row',
  },
  searchInput:{
    paddingVertical:3,
    paddingHorizontal:6,
    width:"80%"
  },
  searchSvg:{
    alignSelf: "flex-end" , 
    position:'absolute' ,
    right:5
  },
  containerUserList:{
    borderWidth:2,
    borderColor:"#E69400",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F5F5F5',
    marginTop:8,
    height:"100%"
  },
  listItem: {
    flexDirection: 'row',
    borderWidth:2,
    borderColor:"#E69400",
    borderRadius:20,
    padding: 5,
    marginVertical:4,
    width:"100%",
  },
    titleContainer:{
        borderBottomColor: '#F6F4EB',
        borderBottomWidth: 2,
        marginHorizontal:25,
        marginVertical:20,
        width:130,
        paddingBottom:5

    },
    profileTitle:{
        fontSize:30,
        color:"#F6F4EB"
    },
    mapContainer:{
        borderWidth:1,
        width:"50%",
        paddingVertical:10,
        marginVertical:10,
        borderRadius:10
    },
    mapText:{
        fontSize:20,
        paddingLeft:5
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
    image: {
      width: 50, 
      height: 50,
      borderRadius: 25,
      marginHorizontal:8
    },
});