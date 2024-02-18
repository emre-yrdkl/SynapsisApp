import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, ScrollView, Alert, Button, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../authContext/AuthContext';
import Chat from '../items/Chat';
import { useNavigation } from '@react-navigation/native';
import NameOtherSvg from '../svg/nameOtherPages';
import SearchSvg from '../svg/search';

//----------------------------------------------------------------
//----------------------------------------------------------------

const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

function getInitials(fullName) {
  const words = fullName.split(' ');

  let initials = '';

  for (const word of words) {
    if (word.length > 0) {
      initials += word[0].toUpperCase();
    }
  }
  console.log("initial: ",initials)
  return initials;
}

export default function Home(){

    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();

    useEffect(()=>{

      fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/users', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(async (res)=>{
        if(res.status == 200){
          const result = await res.json()
          console.log("RESULT: ",result)
          setUsers(result.userList)
        }
        else{
          throw res.status
        }
      })
    },[])


    return(
        <View >

        <View style={styles.nameContainer}>
            <NameOtherSvg/>
        </View>
        <Text style={styles.title}>Messages</Text>

        <View style={styles.containerSearch}>
          <View style={styles.searchInputView}>
              <TextInput style={styles.searchInput} placeholder={'Search...'} placeholderTextColor="rgba(255, 159, 28, 0.50)" />
              <SearchSvg style={styles.searchSvg}/>
          </View>
        </View>


        <View style={styles.containerUserList}>
        <View style={{padding:5}}>
          <Text style={styles.header}>Connected Users</Text>
              <FlatList
                style={styles.flatList}
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.listItem} onPress={()=>{navigation.navigate('Chat', { user1:user, user2:item})}}>
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
        </View>

        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  containerSearch:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:16
  },
  nameContainer:{
    alignSelf: 'center',
    marginTop:42
  },
  title:{
    color:"#FF6F61",
    fontFamily:"ArialRoundedMTBold",
    fontSize:35,
    fontWeight:400,
    marginTop:58,
    textAlign:"center",
  },
  input:{
    width:280,
    paddingVertical:7,
    marginVertical:10,
    borderWidth:2
  },
  searchInputView:{
    borderWidth:2,
    borderColor:"#FF9F1C",
    borderRadius:10,
    paddingVertical:5,
    width:"90%",
    flexDirection: 'row',
  },
  searchInput:{
    paddingVertical:3,
    paddingHorizontal:6,
    outlineStyle: 'none',
    width:"80%"
  },
  searchSvg:{
    alignSelf: "flex-end" , 
    position:'absolute' ,
    right:5
  },
  sendButton:{
    backgroundColor:"#0000FF",
    height:35,
    width:110,
    justifyContent: 'center',
    borderRadius:6
  },
  sendButtonText:{
    color:"#FFF",
    textAlign:"center",
    fontSize:17
  },
  inputContainer:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer:{
    marginVertical:20,
    marginHorizontal:10
  },
  textContainer:{
    flexDirection: "row",
    alignItems: "center",    // Center vertically
    marginBottom:3,

  },
  nameText:{
    width:30,
    height:30,
    borderRadius:25,
    backgroundColor:"#9932CC",
    color:"#F0F8FF",
    marginRight:5, 
    textAlign: 'center', 
    lineHeight: 30, // Center vertically
  },
  containerUserList:{
    borderWidth:2,
    borderColor:"#FF9F1C",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F5F5F5',
    marginTop:8
  },
  header: {
    // Your header (h3) styles
    fontSize: 20,
    fontWeight: 'bold',
  },
  listItem: {
    // Your list item (li) styles
    borderWidth:1,
    borderColor:"#000",
    borderRadius:10,
    padding: 10,
    marginVertical:4
  },
})