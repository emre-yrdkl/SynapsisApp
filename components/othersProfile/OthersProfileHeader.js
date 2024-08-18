import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import NameOtherSvg from '../svg/nameOtherPages';
import GoBackSvg from '../svg/goBackOrange';
import { verticalScale, horizontalScale, height } from '../themes/Metrics';

const OthersProfileHeader = ({ navigation }) => {
  return (
    <>
      {height > 700 ? (
        <View style={styles.nameContainerTall}>
          <NameOtherSvg />
        </View>
      ) : (
        <View style={styles.nameContainerShort}>
          <NameOtherSvg />
        </View>
      )}
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <GoBackSvg />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  nameContainerShort: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
    margin: verticalScale(40),
    zIndex: 5,
  },
  nameContainerTall: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
    margin: verticalScale(50),
    zIndex: 5,
  },
  goBackButton: {
    position: 'absolute',
    top: verticalScale(26),
    left: horizontalScale(4),
    zIndex: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default ProfileHeader;
