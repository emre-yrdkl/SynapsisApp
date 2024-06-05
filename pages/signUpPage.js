import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LogoSvg from '../svg/logo';
import { horizontalScale, verticalScale, height } from '../themes/Metrics';

const AlertDialog = (title, message) =>
  Alert.alert(title, message, [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const logoSize = useRef(new Animated.Value(height > 700 ? 200 : 150)).current;
  const marginTop = useRef(new Animated.Value(verticalScale(40))).current;

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyboardShow = () => {
    Animated.parallel([
      Animated.timing(logoSize, {
        toValue: height > 700 ? 150 : 100,
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
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(logoSize, {
        toValue: height > 700 ? 220 : 150,
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

  async function registerUser() {
    if (password === repassword) {
      try {
        const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/register', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": email,
            "password": password,
          }),
        });

        if(response.status == 200) {
          AlertDialog("Success", "Successfully registered");
          navigation.replace("Sign");
        }
        else if(response.status == 404) {
          const data = await response.json();
          AlertDialog("Error", data.message);
        }
        else if(response.status == 409) {
          const data = await response.json();
          AlertDialog("Error", data.message);
        }
        
      } catch (error) {
        console.log("error:", error);
      }
    } else {
      AlertDialog("Error", "Password does not match");
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Animated.View style={{ alignSelf: 'center', marginTop: verticalScale(50), width: logoSize, height: logoSize }}>
            <LogoSvg style={styles.svg} />
          </Animated.View>

          <View style={styles.inputContainer}>
            <Text style={styles.signupText}>Sign Up</Text>

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
                style={styles.input2}
                placeholder="Password"
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

            <View style={[styles.input, { marginTop: 10 }]}>
              <TextInput
                secureTextEntry={!showPassword}
                value={repassword}
                onChangeText={setRepassword}
                style={styles.input2}
                placeholder="Re-password"
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
              <TouchableOpacity style={styles.button} onPress={registerUser}>
                <Text style={styles.buttonText}>
                  Register
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
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  svg: {
    marginHorizontal: "auto",
  },
  emailContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    width: horizontalScale(280),
    height: verticalScale(55),
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9F1C',
  },
  icon: {
    marginLeft: 10,
  },
  signupText: {
    color: '#FF6F61',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  input2: {
    flex: 1,
    paddingVertical: 7,
    paddingRight: 10,
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
    backgroundColor: "#FF9F1C",
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'ABeeZeeRegular',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#F5F5F5',
  },
  buttonContainer: {
    marginTop: verticalScale(30),
  }
});
