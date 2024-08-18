import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LoadSpinnerHome = () => (
  <View style={styles.container}>
    <Image source={require('../assets/gifs/loading.gif')} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  image: {
    width: 250,
    height: 250,
  },
});

export default LoadingSpinner;
