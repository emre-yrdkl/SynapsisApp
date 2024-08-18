import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { verticalScale, horizontalScale } from '../../themes/Metrics';

const NameInput = ({ name, setName, error }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Name</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputName}
          onChangeText={(text) => { setName(text); }}
          value={name}
          placeholder="Name"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', height: '100%' },
  title: { color: '#E69400', fontFamily: 'ArialRoundedMTBold', fontSize: 32, fontWeight: '400', marginTop: verticalScale(50) },
  inputView: { marginTop: verticalScale(50) },
  inputName: { flexDirection: 'row', width: horizontalScale(280), height: verticalScale(55), paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#4C4C4C', fontSize: 16 },
  errorText: { color: 'red', marginTop: 4 },
});

export default NameInput;
