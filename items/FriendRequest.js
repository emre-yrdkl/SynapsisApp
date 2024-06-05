import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, LayoutAnimation, Platform, UIManager, Image } from 'react-native';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FriendRequest = ({ onToggle, initialData = [], receiverId }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [data, setData] = useState(initialData);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCollapsed) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      if(data.length>3){
        Animated.timing(animatedHeight, {
          toValue: 60*3, // Adjust as needed
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
      else{
        Animated.timing(animatedHeight, {
          toValue: 60*data.length, // Adjust as needed
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [isCollapsed]);

  const toggleCollapsed = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCollapsed(!isCollapsed);
    onToggle(!isCollapsed);
  };

  const approveFriend = async (senderId, friendshipId) => {

    console.log("approveFriend",{
      "senderUserId":senderId,
      "receiverUserId": receiverId,
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
            "senderUserId":senderId,
            "receiverUserId": receiverId,
            "friendshipId": friendshipId,
            "evaluation":true
        })
    })

    const data = await response.json()

    if (response.status === 200 && data.friendshipUpdated.status === "confirmed") {
      console.log("sago",data)
      setData(prevData => prevData.filter(request => request.friendshipId !== friendshipId));
    }  else { 
        AlertDialog("Error",data.error)
    }
}

const rejectFriend = async (senderId, friendshipId) => {
        
    const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/approveRejectFriend', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "senderUserId":senderId,
            "receiverUserId": receiverId,
            "friendshipId": friendshipId,
            "evaluation":false
        })
    })

    const data = await response.json()

    if (response.status === 200 && data === "friendship deleted") {
        setData(prevData => prevData.filter(request => request.friendshipId !== friendshipId));
    }  else { 
        AlertDialog("Error",data.error)
    }
}


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleCollapsed} style={styles.header}>
        <Text style={styles.headerText}>{data.length} requests</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.collapsible, { height: animatedHeight }]}>
        <ScrollView>
          {data.length > 0 && data.map((request, index) => (
            <View key={index} style={styles.request}>
              <View style={{flexDirection:"row", alignItems:"center"}}>
              <Image source={{ uri: request.userInfo.preferences.imageUrl }} style={styles.image} resizeMode="cover"/>

                <Text style={{marginLeft:12}}>{request.userInfo.preferences.name}</Text>
              </View>
              
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.buttonApprove} onPress={()=>approveFriend(request.userInfo._id,request.friendshipId)}>
                  <Text style={{fontSize:16, color:"#FEFEFE"}}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonReject} onPress={()=>rejectFriend(request.userInfo._id,request.friendshipId)}>
                  <Text style={{fontSize:16, color:"#FEFEFE"}}>✗</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    backgroundColor: '#ddd',
    padding: 10,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    marginTop: 2,
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',

  },
  collapsible: {
    overflow: 'hidden',
  },
  request: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttons: {
    flexDirection: 'row',
  },
  buttonApprove: {
    marginLeft: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#3CCC7A',
    borderRadius: 5,
    backgroundColor: "#3CCC7A",
  },
  buttonReject: {
    marginLeft: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FF6F61',
    borderRadius: 5,
    backgroundColor: "#FF6F61",
  },
  image: {
    width: 40, 
    height: 40,
    borderRadius: 20,
  },
});

export default FriendRequest;
