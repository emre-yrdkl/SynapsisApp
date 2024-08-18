import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { horizontalScale, verticalScale } from '../../themes/Metrics';

const ButtonsContainer = ({ navigation }) => {
  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={styles.loginContainer}
        onPress={() => navigation.navigate('Sign')}
      >
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerContainer}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: verticalScale(110),
  },
  loginContainer: {
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FF9F1C',
    backgroundColor: '#F5F5F5',
    width: horizontalScale(250),
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
  },
  loginText: {
    color: '#FF9F1C',
    textAlign: 'center',
    fontFamily: 'ABeeZeeRegular',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  registerContainer: {
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#F5F5F5',
    backgroundColor: '#FF9F1C',
    width: horizontalScale(250),
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#F5F5F5',
    textAlign: 'center',
    fontFamily: 'ABeeZeeRegular',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
});

export default ButtonsContainer;
