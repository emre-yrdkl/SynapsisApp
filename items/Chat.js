import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard  } from "react-native";
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../authContext/AuthContext';
import GoBackSvgWhite from "../svg/goBackWhite";
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';

const generateUniqueId = () => {
  return 'xxxxxxxxyxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }) + Date.now().toString(16);
};


function Chat({navigation}) {
  const { user, socket, receiveMessage } = useAuth();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [dmId, setDmId] = useState("")

  const scrollViewRef = useRef(); // Create a ref using useRef hook
  const route = useRoute();
  const { user1, user2 } = route.params;

  const sendMessage = async () => {
    if (currentMessage !== "") {

      const uniqueId = generateUniqueId();

      socket.emit("send_message", {_id: uniqueId, dmId: dmId, receiverUserId:user2.senderId, senderUserId:user1.userId, senderUserName:user1.userName, content:currentMessage})

      setMessageList([...messageList, {description:currentMessage, author:user1.userId, createdAt:Date.now()}])

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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  

  useEffect(()=>{
    console.log("receiveMessage",receiveMessage)
    if(receiveMessage.dmId == dmId){
      setMessageList([...messageList, {description:receiveMessage.content, author:receiveMessage.senderUserId, createdAt:Date.now()}])
    }
  },[receiveMessage])

  useEffect(() => {
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
    <KeyboardAvoidingView
      style={styles.chatWindow}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} // Adjust this value as needed
    >
      <View style={{...styles.headerView, paddingTop: height>700 ? 36:20}}>
        <TouchableOpacity style={styles.iconBack} onPress={() => navigation.goBack()}>
          <GoBackSvgWhite />
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
              {user1.userId === messageContent.author ? (
                <>
                <Text style={styles.author}></Text>
                <Text style={styles.time}>{formatTime(messageContent.createdAt)}</Text>
                </>
              ) : (
                <>
                <Text style={styles.time}>{formatTime(messageContent.createdAt)}</Text>
                <Text style={styles.author}></Text>
                </>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{...styles.chatFooter, marginBottom:height> 700 ? 12: 4}}>
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
    </KeyboardAvoidingView>
  );
  
  
}

const styles = StyleSheet.create({
  chatWindow: {
    flex: 1, // Ensure the chat window takes the full height
    justifyContent: "flex-start",
    backgroundColor: "#fff5e8",
  },
  textHeader:{
    fontSize:20,
    color:"#000"
  },
  chatBody: {
    paddingHorizontal: 10,
  },
  message: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginVertical: 4,
    maxWidth:"60%"
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
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#fefefe',
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
    backgroundColor: '#FF9F1C', // Background color
  },
  iconBack:{
    marginLeft:8,
    padding:16,
  },
  headerText:{
    marginLeft:12,
    fontSize: 20, // Example font size
    fontWeight: 'bold',
    color: '#FEFEFE',
  }

});

export default Chat;
