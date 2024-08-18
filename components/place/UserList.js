import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { verticalScale, width, height } from '../../themes/Metrics';

const UserList = ({ receiveUserList, user, navigation }) => {
  return (
    <View style={styles.listView}>
      {receiveUserList.length === 1 && (
        <Text style={styles.noUsersText}>No one is here</Text>
      )}

      {receiveUserList.length > 1 && (
        <FlatList
          data={receiveUserList.filter((item) => item.userId !== user.userId)}
          keyExtractor={(item) => item.userId}
          numColumns={3}
          style={styles.flatList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('OthersProfile', { searcherId: user.userId, searchedId: item.userId, friendshipId: item.friendshipId })}
            >
              <Image source={{ uri: item.preferences?.imageUrl }} style={styles.image} resizeMode="cover" />
              <View style={styles.itemCardView}>
                <View style={styles.itemCardTextView}>
                  <Text style={styles.ItemCardText}>{item.preferences?.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listView: {
    borderWidth: 2,
    borderColor: "#FF9F1C",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#fff5e8",
    marginTop: 8,
    height: height - verticalScale(225),
  },
  noUsersText: {
    textAlign: "center",
    marginTop: 10,
    fontFamily: "ArialRoundedMTBold",
    fontSize: 20,
    color: "#E69400",
  },
  flatList: {
    paddingHorizontal: 5,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    maxWidth: (width - 34) / 3,
  },
  itemCardView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  itemCardTextView: {
    flex: 1,
  },
  ItemCardText: {
    textAlign: "left",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 145,
    borderRadius: 10,
  },
});

export default UserList;
