import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';

const Notification = ({ message }) => {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current; // Initial position off the screen

  useEffect(() => {
    // Trigger the slide down and up animation
    if (Object.keys(message).length != 0) {
      setVisible(true);
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0, // Slide to top of the screen
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(3000), // Stay visible for 3 seconds
        Animated.timing(slideAnim, {
          toValue: -100, // Slide back up
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false); // Hide the component after animation
      });
    }
  }, [message, slideAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}>
        <Text style={{color: '#fefefe', fontSize:16}}>{message.senderUserName}</Text>
        <View style={{marginTop:7}}>
          <Text style={styles.message}>{message.content}</Text>
        </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#36454F',
    padding: 12,
    margin:10,
    borderRadius:8,
  },
  message: {
    color: '#fefefe',
    fontSize: 12,
  },
});

export default Notification;
