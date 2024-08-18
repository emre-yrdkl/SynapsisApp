import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { verticalScale } from '../themes/Metrics';

const FriendshipActions = ({
  friendRequestStatus,
  setFriendRequestStatus,
  searcherId,
  searchedId,
  friendshipId,
}) => {
  const addToFriend = async () => {
    // Function logic for adding a friend
    setFriendRequestStatus('pending');
  };

  const approveFriend = async () => {
    // Function logic for approving a friend request
    setFriendRequestStatus('confirmed');
  };

  const rejectFriend = async () => {
    // Function logic for rejecting a friend request
    setFriendRequestStatus('No relation');
  };

  return (
    <View style={styles.buttonView}>
      {friendRequestStatus === 'confirmed' && (
        <View style={styles.buttonConfirm}>
          <Text style={styles.buttonText}>Your Friend</Text>
        </View>
      )}
      {friendRequestStatus === 'pending' && (
        <View style={styles.buttonPending}>
          <Text style={styles.buttonText}>Pending</Text>
        </View>
      )}
      {friendRequestStatus === 'onApprovement' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonAccept} onPress={approveFriend}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonReject} onPress={rejectFriend}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {friendRequestStatus === 'No relation' && (
        <TouchableOpacity style={styles.buttonAddFriend} onPress={addToFriend}>
          <Text style={styles.buttonText}>Add to Friend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    marginTop: verticalScale(30),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonAddFriend: {
    backgroundColor: '#6699FF',
    padding: 10,
    borderRadius: 10,
    marginVertical: verticalScale(15),
  },
  buttonReject: {
    flex: 1,
    backgroundColor: '#FFABAB',
    padding: 10,
    borderRadius: 10,
    marginVertical: verticalScale(15),
    marginHorizontal: 6,
  },
  buttonPending: {
    backgroundColor: '#FFD18C',
    padding: 10,
    borderRadius: 10,
    marginVertical: verticalScale(15),
  },
  buttonConfirm: {
    backgroundColor: '#4F9DFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: verticalScale(15),
  },
  buttonAccept: {
    flex: 1,
    backgroundColor: '#66FF99',
    padding: 10,
    borderRadius: 10,
    marginVertical: verticalScale(15),
    marginHorizontal: 6,
  },
  buttonText: {
    fontSize: 15,
    color: '#F5F5F5',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'ArialRoundedMTBold',
  },
});

export default FriendshipActions;
