import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { verticalScale, horizontalScale } from '../../themes/Metrics';

const BioInput = ({ bio, setBio }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bio</Text>
      <TextInput
        style={styles.inputBio}
        multiline={true}
        onChangeText={setBio}
        placeholder="Enter your bio here"
        numberOfLines={4}
        value={bio}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', height: '100%' },
  title: { color: '#E69400', fontFamily: 'ArialRoundedMTBold', fontSize: 32, fontWeight: '400', marginTop: verticalScale(50) },
  inputBio: { marginTop: verticalScale(50), borderWidth: 1, width: horizontalScale(280), minHeight: verticalScale(100), borderRadius: 10, borderColor: "#4C4C4C", paddingHorizontal: 6, paddingVertical: 5, fontSize: 16 },
});

export default BioInput;
