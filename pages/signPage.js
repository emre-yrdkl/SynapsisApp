import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Animated, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../authContext/AuthContext';
import LogoSvg from '../svg/logo';
import { horizontalScale, verticalScale, height } from '../themes/Metrics';
import GoBackSvg from '../svg/goBackOrange';

const AlertDialog = (title, message) =>
  Alert.alert(title, message, [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);

export default function Sign({ navigation }) {
  const { signIn, socket, setPreferences, setUserId } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const logoSize = useRef(new Animated.Value(height > 700 ? 200 : 150)).current;
  const marginTop = useRef(new Animated.Value(verticalScale(40))).current;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyboardShow = () => {
    Animated.parallel([
      Animated.timing(logoSize, {
        toValue: height > 700 ? 180 : 120,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(marginTop, {
        toValue: verticalScale(20),
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleKeyboardHide = () => {
    Animated.parallel([
      Animated.timing(logoSize, {
        toValue: height > 700 ? 260 : 180,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(marginTop, {
        toValue: verticalScale(40),
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  async function loginUser() {
    try {
      fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/auth/authenticate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "password": password,
        }),
      }).then(async (res) => {
        if (res.status == 200) {
          const result = await res.json();
          signIn(result.userToken, result.userInfo);
          setUserId(result.userInfo.userId);
          socket.emit("setup", { userId: result.userInfo.userId });
          console.log("result.userInfo", result.userInfo);
          const responsePreferences = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/checkPreferences', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "userId": result.userInfo.userId,
            })
          });
          const resultPreferences = await responsePreferences.json();

          if (resultPreferences.preferencesExist) {
            setPreferences(resultPreferences.preferences);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            })
            //navigation.replace("Dashboard");
          }
          else {
            navigation.replace("Preferences");
          }
        }
        else if (res.status == 400) {
          const result = await res.json();
          AlertDialog("Error", result.message);
        }
        else if (res.status == 401) {
          const result = await res.json();
          AlertDialog("Error", result.message);
        }
        else {
          throw res.status;
        }
      });
    } catch (error) {
      console.log("err:", error);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
        <TouchableOpacity style={{position:"absolute", top:verticalScale(26), left:horizontalScale(4), zIndex:5, paddingVertical:12, paddingHorizontal:16}} onPress={() => navigation.goBack()}>
            <GoBackSvg />
        </TouchableOpacity>
          <Animated.View style={{ alignSelf: 'center', marginTop: verticalScale(50), width: logoSize, height: logoSize }}>
            <LogoSvg style={styles.svg} />
          </Animated.View>

          <View style={styles.inputContainer}>
            <Text style={styles.loginText}>Log in</Text>

            <Animated.View style={{ ...styles.emailContainer, marginTop }}>
              <TextInput
                style={styles.input}
                placeholder={'Email'}
                placeholderTextColor="#ffc16f"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </Animated.View>

            <View style={styles.input}>
              <TextInput
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.inputPass}
                placeholder="Enter Password"
                placeholderTextColor="#ffc16f"
              />
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#FF9F1C"
                style={styles.icon}
                onPress={toggleShowPassword}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => loginUser()}>
                <Text style={styles.buttonText}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff5e8",
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  svg: {
    marginHorizontal: "auto",
  },
  icon: {
    marginLeft: 10,
  },
  emailContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  loginText: {
    color: '#FF6F61',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    width: horizontalScale(280),
    height: verticalScale(55),
    padding: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9F1C',
    backgroundColor: "#fff"

  },
  inputPass: {
    flex: 1,
    paddingRight: 10,
    paddingVertical: 7,
  },
  button: {
    display: 'flex',
    width: horizontalScale(200),
    height: verticalScale(55),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FF9F1C",
    backgroundColor: "#fff"
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'ABeeZeeRegular',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#FF9F1C'
  },
  buttonContainer: {
    marginTop: verticalScale(30),
  },
  iconBack: {
    position: "absolute",
    marginTop: 40,
    marginLeft: 10,
    zIndex: 1
  },
});
