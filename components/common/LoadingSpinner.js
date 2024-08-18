import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LoadingSpinner = () => (
  <View style={styles.container}>
    <Image source={require('../../assets/gifs/loading.gif')} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
});

export default LoadingSpinner;
