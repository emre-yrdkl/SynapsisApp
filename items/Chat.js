import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../authContext/AuthContext';


function Chat({navigation}) {
  const { user, socket, receiveMessage } = useAuth();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [dmId, setDmId] = useState("")
  const scrollViewRef = useRef(); // Create a ref using useRef hook
  const route = useRoute();
  const { user1, user2 } = route.params;
  
console.log("user1",user1)
console.log("user2",user2)


  const sendMessage = async () => {
    if (currentMessage !== "") {

      socket.emit("send_message", {dmId: dmId, receiverUserId:user2.senderId, senderUserId:user1.userId, senderUserName:user1.userName, content:currentMessage})

      setMessageList([...messageList, {description:currentMessage, author:user1.userId}])

      console.log("body: ",user1.userId,currentMessage,dmId)
      fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/message/sendMessage', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "userId":user1.userId,            
          "messageContent":currentMessage,
          "dmId":dmId      
      })
    }).then(async (res)=>{
      if(res.status == 200){
        const result = await res.json()
        console.log("RESULT dm content: ",result)
      }
      else{
        throw res.status
      }
      })
      setCurrentMessage("");
    }
  };

  useEffect(()=>{
    console.log("receiveMessage",receiveMessage)
    if(receiveMessage.dmId == dmId){
      setMessageList([...messageList, {description:receiveMessage.content, author:receiveMessage.senderUserId}])
    }
  },[receiveMessage])

  useEffect(() => {
    console.log("user1",user1)
    console.log("user2",user2)
    //setMessageList((list) => [...list, messageData]);
    

    console.log("useeffect",user1,user2)
    fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/dm/getDmMessages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "userId1":user1.userId,            
          "userId2":user2.senderId,            
      })
    }).then(async (res)=>{
      if(res.status == 200){
        const result = await res.json()
        console.log("RESULT dm list: ",result)
        setDmId(result.dm)
        setMessageList(result.messages)
      }
      else{
        throw res.status
      }
    })
    
    /*socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });*/
  }, []);

  return (
    <View style={styles.chatWindow}>
      <View style={styles.headerView}>
        <TouchableOpacity style={styles.iconBack} onPress={()=>navigation.replace("Dashboard")}>
          <MaterialCommunityIcons 
                  name="arrow-left"
                  size={28} 
                  color="#FEFEFE"
              /> 
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {user2.senderName}
        </Text>
      </View>
      
      <ScrollView
        style={styles.chatBody}
        ref={scrollViewRef} // Assign the ref here
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messageList.map((messageContent, index) => (
          <View
            key={index}
            style={[
              styles.message,
              user1.userId === messageContent.author ? styles.myMessage : styles.otherMessage
            ]}
          >
            <View style={styles.messageContent}>
              <Text style={styles.description}>{messageContent.description}</Text>
            </View>
            <View style={styles.messageMeta}>
              {/* <Text style={styles.time}>{messageContent.createdAt.slice(11,16)}</Text>  */ }
              {/* <Text style={styles.author}>{messageContent.author==user1._id? user1.userName: user2.name}</Text> */}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.chatFooter}>
        <TextInput
          style={styles.input}
          value={currentMessage}
          placeholder="Hey..."
          onChangeText={setCurrentMessage}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatWindow: {
    maxHeight:500,
    justifyContent: "center",
  },
  textHeader:{
    fontSize:20,
    color:"#000"
  },
  chatBody: {
    padding: 10,
  },
  message: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF9F1C',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#36454F',
  },
  messageContent: {
    marginBottom: 5,
  },
  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 10,
    color: '#fefefe',
  },
  description:{
    color:"#fefefe",
  },
  author: {
    fontSize: 10,
    color: '#fefefe',
  },
  chatFooter: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius:10,
    backgroundColor:"#6495ED",
  },
  sendButtonText:{
    color:"#fff"
  },
  headerView:{
    flexDirection: 'row', // Align items in the same row
    alignItems: 'center', // Align items vertically centered
    borderBottomLeftRadius: 15, // Bottom left border radius
    borderBottomRightRadius: 15, // Bottom right border radius
    height: 99, // Height
    backgroundColor: '#FF9F1C', // Background color
  },
  iconBack:{
    marginLeft:10,
  },
  headerText:{
    marginLeft:20,
    fontSize: 20, // Example font size
    fontWeight: 'bold',
    color: '#FEFEFE',
  }

});

export default Chat;
