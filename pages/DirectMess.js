import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';
import { useAuth } from '../authContext/AuthContext';
import { useNavigation } from '@react-navigation/native';

const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

export default function DirectMessage(){
    const { user } = useAuth();
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [allUsers,setAllUsers] = useState([])
    const [usersInfo, setUsersInfo] = useState([])
    const [dms,setDms] = useState([])
    const navigation = useNavigation();

    async function getUserInfo() {
        
	}

    useEffect( ()=>{
        console.log("useruser",user)
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
              setAllUsers(result.userList)

              fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/dm/getDms', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "userId":user.userId,            
                })
              }).then(async (res2)=>{
                if(res2.status == 200){
                  const result2 = await res2.json()
                  console.log("RESULT get dms: ",result2)
                  setDms(result2.dmList)
                  result2.dmList.forEach(element => {
                    console.log("hahah",result.userList)
                    let id = ""
                    element.users.forEach(elm =>{
                        if(elm != user.userId){
                            id = elm
                        }
                    })
                    let arr = []
                    result.userList.map(data =>{
                        //console.log("data._id: ",data._id," id",id)
                        if(data._id == id){
                            let newArr = usersInfo
                            newArr.push(data)
                            setUsersInfo(newArr)
                        }
                    })
                  });
                }
                else{
                  throw res.status
                }
              })

            }
            else{
              throw res.status
            }
          }).finally(()=>{
            getUserInfo()

          })

    },[])

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.profileTitle}>
                    Direct Message
                </Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>

            {
                usersInfo.map((data,index)=>{
                    return(
                        <TouchableOpacity key={index} style={styles.mapContainer} onPress={()=>{navigation.navigate('Chat', { user1:user, user2:data})}}>
                            <Text style={styles.mapText}>
                                {data.name}
                            </Text>
                        </TouchableOpacity>
                        
                    )
                })
            }
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
    }
});