import { StyleSheet, Text, View, Alert, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../authContext/AuthContext';
import { useNavigation } from '@react-navigation/native';
import NameOtherSvg from '../svg/nameOtherPages';
import { verticalScale, height } from '../themes/Metrics';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/directMessage/SearchBar';
import MessageItem from '../components/directMessage/MessageItem';

const AlertDialog = (title, message) => Alert.alert(title, message, [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);

export default function DirectMessage() {
  const { user, receiveMessage } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [usersInfoFilter, setUsersInfoFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const userResponse = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/users');
        if (userResponse.status === 200) {
          const { userList } = await userResponse.json();
          setAllUsers(userList);

          const dmResponse = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/dm/getDms', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "userId": user.userId }),
          });

          if (dmResponse.status === 200) {
            const { dmList } = await dmResponse.json();
            const updatedDmList = dmList.map(dm => {
              dm.users.forEach(userId => {
                if (userId !== user.userId) {
                  const userInfo = userList.find(u => u._id === userId);
                  if (userInfo) {
                    dm.senderName = userInfo.preferences?.name;
                    dm.senderId = userInfo._id;
                    dm.imageUrl = userInfo.preferences?.imageUrl;
                  }
                }
              });
              return dm;
            });

            setUsersInfo(updatedDmList);
            setUsersInfoFilter(updatedDmList);
            setLoading(false);
          } else {
            throw new Error(dmResponse.status);
          }
        }
      } catch (error) {
        AlertDialog("Error", "Something went wrong. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [receiveMessage]);

  const handleSearch = (searchText) => {
    const filteredUsers = usersInfo.filter(item => item.senderName.includes(searchText));
    setUsersInfoFilter(filteredUsers);
  };

  return (
    <View style={styles.container}>
      {height > 700 ? <NameOtherSvg style={styles.nameContainerTall} /> : <NameOtherSvg style={styles.nameContainerShort} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Text style={styles.title}>Messages</Text>
          <SearchBar onSearch={handleSearch} />
          <View style={styles.containerUserList}>
            {usersInfoFilter.length === 0 ? (
              <Text style={styles.noMessagesText}>No Messages</Text>
            ) : (
              <FlatList
                data={usersInfoFilter}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <MessageItem
                    item={item}
                    onPress={() => navigation.navigate('Chat', {
                      user1: { userId: user.userId, userName: user.preferences?.name },
                      user2: item,
                    })}
                  />
                )}
              />
            )}
          </View>
        </>
      )}
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
  searchInput: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: "90%",
  },
  searchSvg: {
    alignSelf: "flex-end",
    right: 5,
  },
  containerUserList: {
    borderWidth: 2,
    borderColor: "#FF9F1C",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff5e8',
    marginTop: 8,
    height: height - verticalScale(287),
  },
  noMessagesText: {
    textAlign: "center",
    marginTop: 10,
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 20,
    color: "#E69400",
  },
  senderName: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 15,
    fontWeight: '400',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 8,
    marginRight: 16,
  },
});
