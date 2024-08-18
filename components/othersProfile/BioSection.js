import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { verticalScale } from '../../themes/Metrics';

const BioSection = ({ userInfo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{userInfo.preferences.name}'s Bio</Text>
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>{userInfo.preferences.bio}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(50),
  },
  headerText: {
    fontSize: 25,
    fontFamily: 'ArialRoundedMTBold',
  },
  bioContainer: {
    marginTop: verticalScale(20),
  },
  bioText: {
    fontSize: 17,
    fontFamily: 'ArialRoundedMTBold',
  },
});

export default BioSection;
