import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MessageBox from '../../svg/messageBox';
import { width } from '../../themes/Metrics';

const FriendItem = ({ item, user, navigation }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() => {
      navigation.navigate('OthersProfile', {
        searcherId: user.userId,
        searchedId: item.userInfo._id,
        friendshipId: item.friendshipId,
      });
    }}
  >
    <Image source={{ uri: item.userInfo.preferences.imageUrl }} style={styles.image} resizeMode="cover" />
    <View style={styles.itemCardView}>
      <View style={styles.itemCardTextView}>
        <Text style={styles.itemCardText}>{item.userInfo.preferences.name}</Text>
      </View>
      <View style={styles.itemCardButtonView}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Chat', {
              user1: { userId: user.userId, userName: user.preferences.name },
              user2: { senderId: item.userInfo._id, senderName: item.userInfo.preferences.name },
            });
          }}
        >
          <MessageBox />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    maxWidth: (width - 34) / 3,
  },
  itemCardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  itemCardTextView: {
    flex: 1,
  },
  itemCardText: {
    textAlign: 'left',
  },
  itemCardButtonView: {
    alignItems: 'flex-end',
    marginLeft: 5,
  },
  image: {
    width: "100%",
    height: 145,
    borderRadius: 10,
  },
});

export default FriendItem;
