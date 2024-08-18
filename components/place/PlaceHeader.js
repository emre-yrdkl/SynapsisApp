import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { verticalScale } from '../themes/Metrics';
import NameOtherSvg from '../svg/nameOtherPages';
import Notification from '../components/Notification';

const PlaceHeader = ({ placeName, currentMessage }) => {
  return (
    <>
      <View style={styles.nameContainer}>
        <NameOtherSvg />
      </View>
      <Text style={styles.placeText}>{placeName}</Text>
      <Notification message={currentMessage} />
    </>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    position: "absolute",
    alignSelf: "center",
    top: 0,
    margin: verticalScale(50),
    zIndex: 5,
  },
  placeText: {
    color: "#FF6F61",
    fontFamily: "ArialRoundedMTBold",
    fontSize: 30,
    marginTop: verticalScale(120),
    textAlign: "center",
  },
});

export default PlaceHeader;
