import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { TimeDisplay } from '../../util/TimeDisplay';

const MessageItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
    <View style={styles.messageView}>
      <View style={styles.messageHeader}>
        <Text style={styles.senderName}>{item.senderName}</Text>
        <Text style={styles.messageTime}>{TimeDisplay(item.latestMessageDate)}</Text>
      </View>
      <Text style={styles.latestMessage}>{item.latestMessage}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  messageView:{
    width: "76%",
  },
  listItem: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: "#FF9F1C",
    backgroundColor: '#ffe2ba',
    borderRadius: 20,
    padding: 5,
    marginVertical: 4,
    width: "100%",
  },
  messageHeader: {
    flexDirection: "row",
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  senderName: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 15,
    fontWeight: '400',
  },
  messageTime: {
    textAlign: 'right',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 13,
    fontWeight: '100',
  },
  latestMessage: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 12,
    fontWeight: '300',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 8,
    marginRight: 16,
  },
});

export default MessageItem;
