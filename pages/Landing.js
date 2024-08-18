import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../authContext/AuthContext';
import LogoContainer from '../components/landing/LogoContainer';
import ButtonsContainer from '../components/landing/ButtonsContainer';

export default function Landing({ navigation }) {
  const { setLocation } = useAuth();

  useEffect(() => {
    async function getLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access location was denied.');
        return;
      }
      const locationInfo = await Location.getCurrentPositionAsync({});
      setLocation(locationInfo.coords.latitude, locationInfo.coords.longitude);
    }
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <LogoContainer />
      <ButtonsContainer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
