import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import GoBackSvgWhiteSmall from '../../svg/goBackWhiteSmall';
import { verticalScale } from '../../themes/Metrics';

const LeaveButton = ({ height, leavePlace }) => {
  return (
    <TouchableOpacity
      style={height > 700 ? styles.leaveButtonTall : styles.leaveButtonShort}
      onPress={leavePlace}
    >
      <GoBackSvgWhiteSmall />
      <Text style={styles.leaveText}>Leave</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  leaveButtonShort: {
    position: "absolute",
    marginHorizontal: verticalScale(10),
    marginVertical: verticalScale(40),
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#FF9F1C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leaveButtonTall: {
    position: "absolute",
    marginHorizontal: verticalScale(10),
    marginVertical: verticalScale(50),
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#FF9F1C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leaveText: {
    fontSize: 20,
    marginLeft: 8,
    fontFamily: "ArialRoundedMTBold",
    color: "#fefefe",
  },
});

export default LeaveButton;
