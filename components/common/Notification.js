import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useAuth } from '../../authContext/AuthContext';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../../themes/Metrics';

const Notification = ({ message }) => {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current; // Initial position off the screen
  const { user, socket, receiveMessage, markMessageAsDisplayed } = useAuth();

  useEffect(() => {

    if (Object.keys(message).length !== 0) {
      setVisible(true);
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0, // Slide to top of the screen
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(750), // Stay visible for 3 seconds
        Animated.timing(slideAnim, {
          toValue: -100, // Slide back up
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false); // Hide the component after animation
        markMessageAsDisplayed(message.content+message.dmId);
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
      <Text style={{color: '#fefefe', fontSize:16, fontWeight:"600"}}>{message.senderUserName}</Text>
      <View style={{marginTop:8}}>
        <Text style={styles.message}>{message.content}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: height>700? 40 : 10,
    left: 10,
    right: 10,
    backgroundColor: '#36454F',
    padding: 12,
    margin:10,
    borderRadius:10,
    zIndex:5
  },
  message: {
    color: '#fefefe',
    fontSize: 14,
  },
});

export default Notification;
