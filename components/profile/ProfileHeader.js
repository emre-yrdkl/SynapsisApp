import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { verticalScale, horizontalScale } from '../../themes/Metrics';

const ProfileHeader = ({ userInfo, onEditProfile, setModalVisible }) => {
  const calculateAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.imageView}>
        <Image source={{ uri: userInfo.preferences.imageUrl }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.infoView}>
        <Text style={styles.nameText}>{`${userInfo.preferences.name}, ${calculateAge(userInfo.preferences.date)}`}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signOutButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', marginTop: 10 },
  imageView: { borderRadius: 10, flex: 2, maxHeight: 170 },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  infoView: { flex: 3, marginLeft: 8, backgroundColor: '#E6940025', borderRadius: 10, paddingHorizontal: 10, alignItems: 'center' },
  nameText: { marginTop: verticalScale(15), fontSize: 25, fontWeight: '600', fontFamily: 'ArialRoundedMTBold' },
  buttonContainer: { flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginTop: verticalScale(30) },
  editButton: { backgroundColor: '#4F9DFF', paddingVertical: 10, borderRadius: 10, marginRight: 8 },
  signOutButton: { backgroundColor: '#FF6F4F', paddingVertical: 10, borderRadius: 10 },
  buttonText: { fontSize: 15, color: '#F5F5F5', textAlign: 'center', fontWeight: '500', fontFamily: 'ArialRoundedMTBold' },
});

export default ProfileHeader;
