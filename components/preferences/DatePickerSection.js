import React from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { verticalScale, horizontalScale } from '../../themes/Metrics';

const DatePickerSection = ({ date, setDate }) => {
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Birthday</Text>
      <DateTimePicker
        value={date}
        mode={'date'}
        is24Hour={true}
        display="spinner"
        onChange={onChangeDate}
        style={styles.datePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', height: '100%' },
  title: { color: '#E69400', fontFamily: 'ArialRoundedMTBold', fontSize: 32, fontWeight: '400', marginTop: verticalScale(50) },
  datePicker: { marginTop: verticalScale(50), marginRight: horizontalScale(20) },
});

export default DatePickerSection;
