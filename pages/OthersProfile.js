import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Alert, Text } from 'react-native';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../components/common/Notification';
import { verticalScale, height } from '../themes/Metrics';
import OthersProfileHeader from '../components/othersProfile/OthersProfileHeader';
import FriendshipActions from '../components/othersProfile/FriendshipActions';
import UserInfoSection from '../components/othersProfile/UserInfoSection';
import InterestsSection from '../components/othersProfile/InterestsSection';
import BioSection from '../components/othersProfile/BioSection';
import { useRoute, useNavigation } from '@react-navigation/native';

const AlertDialog = (title, message) =>
  Alert.alert(title, message, [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);

export default function OthersProfile() {
  const navigation = useNavigation();
  const { user, receiveMessage, displayedMessages } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [friendRequestStatus, setFriendRequestStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [friendshipId, setFriendshipId] = useState('');
  const [currentMessage, setCurrentMessage] = useState({});
  const route = useRoute();
  const { searcherId, searchedId } = route.params;

  useEffect(() => {
    if (receiveMessage && displayedMessages !== receiveMessage.content + receiveMessage.dmId) {
      setCurrentMessage(receiveMessage);
    }
  }, [receiveMessage, displayedMessages]);

  const getUserInfo = async () => {
    try {
      const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/friendship/searchProfile', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searcherUserId: searcherId,
          searchedUserId: searchedId,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setFriendshipId(data.friendshipId);
        setUserInfo(data.userInfo);
        setFriendRequestStatus(data.status);
        setLoading(false);
      } else {
        AlertDialog('Error', data.error);
      }
    } catch (error) {
      AlertDialog('Error', 'Failed to fetch user info.');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <OthersProfileHeader navigation={navigation} />
      {loading && (
        <View style={styles.loadingContainer}>
          <Image source={require('../assets/gifs/loading.gif')} style={styles.loadingImage} />
        </View>
      )}
      {!loading && userInfo.preferences && (
        <>
          <Text style={styles.title}>{userInfo.preferences.name}'s Profile</Text>
          <View style={styles.containerUserList}>
            <ScrollView>
              <View style={styles.scrollViewContent}>
                <UserInfoSection userInfo={userInfo} />
                <FriendshipActions
                  friendRequestStatus={friendRequestStatus}
                  setFriendRequestStatus={setFriendRequestStatus}
                  searcherId={searcherId}
                  searchedId={searchedId}
                  friendshipId={friendshipId}
                />
                <InterestsSection userInfo={userInfo} />
                <BioSection userInfo={userInfo} />
              </View>
            </ScrollView>
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
  title: {
    color: '#FF6F61',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 30,
    marginTop: verticalScale(120),
    textAlign: 'center',
  },
  containerUserList: {
    borderWidth: 2,
    borderColor: '#FF9F1C',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff5e8',
    marginTop: 8,
    height: height - verticalScale(165),
  },
  scrollViewContent: {
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 250,
    height: 250,
  },
});
