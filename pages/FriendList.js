import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Image, Dimensions } from 'react-native';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../items/Notification';
import NameOtherSvg from '../svg/nameOtherPages';
import MessageBox from '../svg/messageBox';
import FriendRequest from '../items/FriendRequest';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AlertDialog = (title, message) =>
  Alert.alert(title, message, [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);

export default function FriendList() {
  const { user, socket, receiveMessage } = useAuth();
  const navigation = useNavigation();
  const [key, setKey] = useState(0); // Add a key state
  const [loading, setLoading] = useState(false);
  const [friendList, setFriendList] = useState([
    {userInfo: {preferences: {name: "", imageUrl: ""}}}
  ]);
  const [requestList, setRequestList] = useState([
    {userInfo: {preferences: {name: "", imageUrl: ""}}, friendshipId:""}
  ]);
  const [isRequestSectionCollapsed, setIsRequestSectionCollapsed] = useState(true);

  useFocusEffect(
    useCallback(() => {
      console.log('Settings Screen was focused');
      getRequests()
      getFriends()

      // Your trigger action here
      return () => {
        console.log('Settings Screen was unfocused');
      };
    }, [])
  );

  const handleToggle = (isCollapsed) => {
    setIsRequestSectionCollapsed(isCollapsed);
  };

  async function getFriends() {
    setLoading(true)
    const res = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/getFriends', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "userId":user.userId
      }),
    })
    console.log("res status: ", res.status)
    const data = await res.json();
    console.log("data status: ", data);
    if (res.status === 200) {
      setFriendList(data)
      setLoading(false)
    } else {
      AlertDialog("Error", res.error);
    }
  }

  async function getRequests() {
    const res = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/getRequests', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "userId":user.userId
      }),
    })
    console.log("res status req: ", res.status)
    const data = await res.json();
    console.log("data status req: ", data);
    if (res.status === 200) {
      setRequestList(data)
    } else {
      AlertDialog("Error", res.error);
    }
  }


  useEffect(() => {
    console.log("receiveMessage", receiveMessage);
    showNotification();
  }, [receiveMessage]);

  const showNotification = () => {
    // Update the message with a unique key every time
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
  };

  return (
    <View style={styles.container}>
      {height > 700 ?
        <View style={styles.nameContainerTall}>
          <NameOtherSvg />
        </View>
        :
        <View style={styles.nameContainerShort}>
          <NameOtherSvg />
        </View>
      }

      {loading &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/gifs/loading.gif')} style={{ width: 250, height: 250 }} />
        </View>
      }
      {!loading &&
      <>
      <Text style={styles.title}>Friend List</Text>

      <View style={[styles.containerUserList, isRequestSectionCollapsed ? {} : { height: height - 200 }]}>
        <FriendRequest onToggle={handleToggle} initialData={requestList} receiverId={user.userId}/>
        {friendList.length > 0 &&
          <FlatList
            data={friendList}
            keyExtractor={item => item.userId}
            numColumns={3}
            style={{paddingHorizontal: 5}}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={()=>{navigation.navigate('OthersProfile', { searcherId:user.userId, searchedId:item.userInfo._id, friendshipId:item.friendshipId})}}>
                <Image source={{ uri: item.userInfo.preferences.imageUrl }} style={styles.image} resizeMode="cover"/>
                {/*<View style={{ width: "100%", height: 145, borderWidth: 2, borderRadius: 8, backgroundColor: "#FF9F1C46", borderColor: "#FF9F1C" }}>
                </View>*/}
                <View style={styles.itemCardView}>
                  <View style={styles.itemCardTextView}>
                    <Text style={styles.ItemCardText}>{item.userInfo.preferences.name}</Text>
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
      </>
      }

      <Notification key={key} message={receiveMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nameContainerShort: {
    position: "absolute",
    alignSelf: 'center',
    top: 0,
    margin: 40,
    zIndex: 5
  },
  nameContainerTall: {
    position: "absolute",
    alignSelf: 'center',
    top: 0,
    margin: 50,
    zIndex: 5
  },
  title: {
    color: "#E69400",
    fontFamily: "ArialRoundedMTBold",
    fontSize: 35,
    marginTop: 100,
    textAlign: "center",
  },
  titleContainer: {
    borderBottomColor: '#F6F4EB',
    borderBottomWidth: 2,
    marginHorizontal: 25,
    marginVertical: 20,
    width: 150,
    paddingBottom: 5
  },
  containerUserList: {
    borderWidth: 2,
    borderColor: "#E69400",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F5F5F5',
    marginTop: 8,
    flex: 1,
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
