import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { useAuth } from '../authContext/AuthContext';
import NameOtherSvg from '../svg/nameOtherPages';
import FriendRequest from '../components/friendList/FriendRequest';
import Notification from '../components/common/Notification';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { height, verticalScale, width } from '../themes/Metrics';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FriendItem from '../components/friendList/FriendItem';

const AlertDialog = (title, message) =>
  Alert.alert(title, message, [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);

export default function FriendList() {
  const { user, receiveMessage, displayedMessages } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [isRequestSectionCollapsed, setIsRequestSectionCollapsed] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({});

  useEffect(() => {
    if (receiveMessage && displayedMessages !== receiveMessage.content + receiveMessage.dmId) {
      setCurrentMessage(receiveMessage);
    }
  }, [receiveMessage, displayedMessages]);

  useFocusEffect(
    useCallback(() => {
      getRequests();
      getFriends();

      return () => {
        console.log('Settings Screen was unfocused');
      };
    }, [trigger])
  );

  const handleToggle = (isCollapsed) => {
    setIsRequestSectionCollapsed(isCollapsed);
  };

  async function getFriends() {
    try {
      setLoading(true);
  
      const res = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/getFriends', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "userId": user.userId }),
      });
  
      const data = await res.json();
      
      if (res.status === 200) {
        setFriendList(data);
      } else {
        AlertDialog("Error", data.error || "Failed to fetch friends.");
      }
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
      AlertDialog("Error", error.message || "An error occurred while fetching friends.");
    }
  }  

  async function getRequests() {
    try {
      const res = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/getRequests', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "userId": user.userId }),
      });
  
      const data = await res.json();
      
      if (res.status === 200) {
        setRequestList(data);
      } else {
        AlertDialog("Error", data.error || "Failed to fetch friend requests.");
      }
    } catch (error) {
      AlertDialog("Error", error.message || "An error occurred while fetching friend requests.");
    }
  }
  

  return (
    <View style={styles.container}>
      {height > 700 ? (
        <View style={styles.nameContainerTall}>
          <NameOtherSvg />
        </View>
      ) : (
        <View style={styles.nameContainerShort}>
          <NameOtherSvg />
        </View>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Text style={styles.title}>Friend List</Text>
          <View style={[styles.containerUserList, isRequestSectionCollapsed ? {} : { height: height - 200 }]}>
            <FriendRequest
              onToggle={handleToggle}
              initialData={requestList}
              receiverId={user.userId}
              setTrigger={setTrigger}
              trigger={trigger}
            />
            {friendList.length === 0 ? (
              <View style={styles.noFriendsContainer}>
                <Text style={styles.noFriendsText}>You don't have any friends yet</Text>
              </View>
            ) : (
              <FlatList
                data={friendList}
                keyExtractor={item => item.userInfo._id}
                numColumns={3}
                style={styles.friendList}
                renderItem={({ item }) => (
                  <FriendItem
                    item={item}
                    user={user}
                    navigation={navigation}
                  />
                )}
              />
            )}
          </View>
        </>
      )}
      <Notification message={currentMessage} />
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
    margin: verticalScale(40),
    zIndex: 5,
  },
  nameContainerTall: {
    position: "absolute",
    alignSelf: 'center',
    top: 0,
    margin: verticalScale(50),
    zIndex: 5,
  },
  title: {
    color: "#FF6F61",
    fontFamily: "ArialRoundedMTBold",
    fontSize: 30,
    marginTop: verticalScale(120),
    textAlign: "center",
  },
  containerUserList: {
    borderWidth: 2,
    borderColor: "#FF9F1C",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff5e8',
    marginTop: 8,
    height: height - verticalScale(225),
  },
  noFriendsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  noFriendsText: {
    color: "#E69400",
    fontSize: 20,
    fontFamily: 'ArialRoundedMTBold',
  },
  friendList: {
    paddingHorizontal: 5,
  },
});
