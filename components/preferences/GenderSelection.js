import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { verticalScale, horizontalScale } from '../../themes/Metrics';

const GenderSelection = ({ selectedGender, setSelectedGender, error }) => {
  const genders = ["Man", "Woman", "Non-binary", "Prefer not to say"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Gender</Text>
      <View style={styles.optionsContainer}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[styles.option, selectedGender === gender ? styles.optionSelected : styles.optionNotSelected]}
            onPress={() => setSelectedGender(gender)}
          >
            <Text style={selectedGender === gender ? styles.optionText : styles.optionNotText}>{gender}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', height: '100%' },
  title: { color: '#E69400', fontFamily: 'ArialRoundedMTBold', fontSize: 32, fontWeight: '400', marginTop: verticalScale(50) },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: verticalScale(50) },
  option: { paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(18), borderRadius: 10, margin: 5 },
  optionSelected: { borderColor: '#F5F5F5', backgroundColor: '#FFB366', borderWidth: 2 },
  optionNotSelected: { borderWidth: 2, borderColor: '#FFB366', backgroundColor: '#F5F5F5' },
  optionText: { color: '#FEFEFE', textAlign: 'center', fontSize: 18 },
  optionNotText: { color: '#FFB366', textAlign: 'center', fontSize: 18 },
  errorText: { color: 'red', marginTop: 4 },
});

export default GenderSelection;
