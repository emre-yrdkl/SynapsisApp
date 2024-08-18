import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../components/common/Notification';
import { height } from '../themes/Metrics';
import { useNavigation } from '@react-navigation/native';
import LeaveButton from '../components/place/LeaveButton';
import UserList from '../components/place/UserList';
import PlaceHeader from '../components/place/PlaceHeader';

export default function Place() {
  const { user, socket, receiveMessage, setCheckInPlace, placeName, roomId, receiveUserList, displayedMessages } = useAuth();
  const [currentMessage, setCurrentMessage] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    if (receiveMessage && displayedMessages !== receiveMessage.content + receiveMessage.dmId) {
      setCurrentMessage(receiveMessage);
    }
  }, [receiveMessage, displayedMessages]);

  const leavePlace = () => {
    socket.emit("leavePlace", { placeId: roomId });
    setCheckInPlace(false);
  };

  return (
    <View style={styles.container}>
      <PlaceHeader placeName={placeName} currentMessage={currentMessage} />
      <LeaveButton height={height} leavePlace={leavePlace} />

      <UserList receiveUserList={receiveUserList} user={user} navigation={navigation} />

      <Notification message={currentMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
