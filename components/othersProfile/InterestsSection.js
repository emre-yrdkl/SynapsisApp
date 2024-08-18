import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { verticalScale } from '../themes/Metrics';

const InterestsSection = ({ userInfo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{userInfo.preferences.name}'s Interests</Text>
      <View style={styles.interestsContainer}>
        {userInfo.preferences.interests.map((interest) => (
          <View key={interest} style={[styles.interest, styles.interestSelected]}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
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
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: verticalScale(30),
  },
  interest: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: 18,
    borderRadius: 10,
    margin: 5,
  },
  interestSelected: {
    backgroundColor: '#FFB366',
    borderWidth: 2,
    borderColor: '#FFB366',
  },
  interestText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default InterestsSection;
