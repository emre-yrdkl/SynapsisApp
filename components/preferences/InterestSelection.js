import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { verticalScale, horizontalScale } from '../../themes/Metrics';

const interests = {
  Sports: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Swimming'],
  Music: ['Rock', 'Pop', 'Classical', 'Jazz', 'Hip-hop'],
  Movies: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Documentary'],
  Books: ['Fiction', 'Romance', 'Mystery', 'Fantasy', 'Horror'],
  Hobbies: ['Cooking', 'Gardening', 'Photography', 'Painting', 'Traveling']
};

const InterestSelection = ({ selectedInterests, setSelectedInterests, error }) => {
  const toggleInterest = (interest) => {
    const index = selectedInterests.indexOf(interest);
    if (index !== -1) {
      setSelectedInterests(prev => prev.filter(item => item !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const isInterestSelected = (interest) => selectedInterests.includes(interest);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Interests</Text>
      <ScrollView style={styles.scrollView}>
        {Object.keys(interests).map((category) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryHeader}>{category}</Text>
            <View style={styles.interestsContainer}>
              {interests[category].map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[styles.interest, isInterestSelected(interest) ? styles.interestSelected : styles.interestNotSelected]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={isInterestSelected(interest) ? styles.interestText : styles.interestNotText}>{interest}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', height: '100%' },
  title: { color: '#E69400', fontFamily: 'ArialRoundedMTBold', fontSize: 32, fontWeight: '400', marginTop: verticalScale(50) },
  scrollView: { marginTop: verticalScale(20), width: '100%' },
  categoryContainer: { marginVertical: verticalScale(10), marginHorizontal: horizontalScale(20) },
  categoryHeader: { color: '#E69400', fontFamily: 'ArialRoundedMTBold', fontSize: 24, fontWeight: '400', marginTop: verticalScale(10), marginBottom: verticalScale(5) },
  interestsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: verticalScale(20) },
  interest: { paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(18), borderRadius: 10, margin: 5 },
  interestSelected: { backgroundColor: '#FFB366', borderWidth: 2, borderColor: '#FFB366' },
  interestNotSelected: { borderWidth: 2, borderColor: '#FFB366', backgroundColor: '#F5F5F5' },
  interestText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  interestNotText: { color: '#FFB366', textAlign: 'center', fontSize: 16 },
  errorText: { color: 'red', marginTop: 4 },
});

export default InterestSelection;
