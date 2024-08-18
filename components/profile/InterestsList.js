import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { verticalScale } from '../../themes/Metrics';

const InterestsList = ({ title, interests }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.interestsContainer}>
      {interests.map((interest) => (
        <View key={interest} style={[styles.interest, styles.interestSelected]}>
          <Text style={styles.interestText}>{interest}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { marginTop: verticalScale(50) },
  title: { fontSize: 25, fontFamily: 'ArialRoundedMTBold' },
  interestsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: verticalScale(30) },
  interest: { paddingVertical: verticalScale(10), paddingHorizontal: 18, borderRadius: 10, margin: 5 },
  interestSelected: { backgroundColor: '#FFB366', borderColor: '#FFB366', borderWidth: 2 },
  interestText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});

export default InterestsList;
