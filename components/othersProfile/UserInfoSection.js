import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { verticalScale } from '../../themes/Metrics';

const UserInfoSection = ({ userInfo }) => {
  const calculateAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <View style={styles.userInfoContainer}>
      <View style={styles.imageView}>
        <Image source={{ uri: userInfo.preferences.imageUrl }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.informationView}>
        <Text style={styles.nameText}>{`${userInfo.preferences.name}, ${calculateAge(userInfo.preferences.date)}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imageView: {
    borderRadius: 10,
    flex: 2,
    maxHeight: 170,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  informationView: {
    flex: 3,
    marginLeft: 15,
    backgroundColor: '#E6940025',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  nameText: {
    marginTop: verticalScale(15),
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'ArialRoundedMTBold',
  },
});

export default UserInfoSection;
