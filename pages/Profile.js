import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { useAuth } from '../../authContext/AuthContext';
import Notification from '../common/Notification';
import ProfileHeader from '../components/profile/ProfileHeader';
import EditProfileModal from '../components/profile/EditProfileModal';
import InterestsList from '../components/profile/InterestsList';
import { verticalScale, horizontalScale, height } from '../../themes/Metrics';
import NameOtherSvg from '../../svg/nameOtherPages';

export default function Profile() {
  const { user, receiveMessage, displayedMessages } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [editTrigger, setEditTrigger] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (receiveMessage && displayedMessages !== receiveMessage.content + receiveMessage.dmId) {
      setCurrentMessage(receiveMessage);
    }
  }, [receiveMessage, displayedMessages]);

  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    try {
      const userInform = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/getUserInfo', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.userId }),
      });
      const data = await userInform.json();
      if (userInform.status === 200) {
        setUserInfo(data.user);
        setLoading(false);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }

  const onEditProfile = () => setEditTrigger(true);
  const onCloseEditModal = () => setEditTrigger(false);

  return (
    <View style={styles.container}>
      {height > 700 ? <NameOtherSvg style={styles.nameContainerTall} /> : <NameOtherSvg style={styles.nameContainerShort} />}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Image source={require('../assets/gifs/loading.gif')} style={styles.loadingGif} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>Your Profile</Text>
          <ProfileHeader userInfo={userInfo} onEditProfile={onEditProfile} setModalVisible={setModalVisible} />
          <View style={styles.containerUserList}>
            <ScrollView>
              <View style={styles.profileDetails}>
                <InterestsList title="Your Interests" interests={userInfo.preferences.interests} />
                <View style={styles.bioContainer}>
                  <Text style={styles.sectionTitle}>Your Bio</Text>
                  <Text style={styles.bioText}>{userInfo.preferences.bio}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </>
      )}
      <Notification message={currentMessage} />
      {editTrigger && <EditProfileModal userInfo={userInfo} onClose={onCloseEditModal} onSave={getUserInfo} />}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonYes]}
                onPress={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Landing' }],
                    });
                  }, 1000);
                }}>
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
              <Pressable style={[styles.button, styles.buttonNo]} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nameContainerShort: { position: 'absolute', alignSelf: 'center', top: 0, margin: verticalScale(40), zIndex: 5 },
  nameContainerTall: { position: 'absolute', alignSelf: 'center', top: 0, margin: verticalScale(50), zIndex: 5 },
  title: { color: '#FF6F61', fontFamily: 'ArialRoundedMTBold', fontSize: 30, marginTop: verticalScale(120), textAlign: 'center' },
  containerUserList: { borderWidth: 2, borderColor: '#FF9F1C', borderTopLeftRadius: 25, borderTopRightRadius: 25, backgroundColor: '#fff5e8', marginTop: 8, height: height - verticalScale(225) },
  profileDetails: { padding: 12 },
  bioContainer: { marginTop: verticalScale(50) },
  sectionTitle: { fontSize: 25, fontFamily: 'ArialRoundedMTBold' },
  bioText: { fontSize: 17, fontFamily: 'ArialRoundedMTBold', marginTop: verticalScale(20) },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingGif: { width: 250, height: 250 },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22 },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 10, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalButtonsContainer: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
  button: { borderRadius: 20, paddingVertical: 10, paddingHorizontal: 24, marginHorizontal: 12, elevation: 2 },
  buttonYes: { backgroundColor: '#FFABAB' },
  buttonNo: { backgroundColor: '#3CCC7A' },
  textStyle: { color: 'white', fontWeight: 'bold', textAlign: 'center', fontFamily: 'ArialRoundedMTBold' },
  modalText: { marginBottom: 15, textAlign: 'center', fontFamily: 'ArialRoundedMTBold', fontSize: 16 },
});
