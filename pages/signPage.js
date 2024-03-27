import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import SvgComponent from '../svg/test';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../authContext/AuthContext';
import LogoSvg from '../svg/logo';

import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';

const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);


export default function Sign({navigation}) {
  const { signIn } = useAuth();
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false); 
  
    // Function to toggle the password visibility state 
    const toggleShowPassword = () => { 
        setShowPassword(!showPassword); 
    }; 

  async function registerUser() {

    navigation.replace("SignUp")

	}

  async function loginUser() {
    try {
      console.log("login")
      console.log(email, password);
      fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/auth/authenticate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email":email,
          "password":password,
        }),
      }).then(async (res)=>{
        if(res.status == 200){
          const result = await res.json()
          signIn(result.userToken, result.userInfo);
          navigation.replace("Dashboard")
        }
        else{
          throw res.status
        }
      })
      /*
      const data = await response.json()
      console.log("data: ",data)
      if (data.userToken) {
        AsyncStorage.setItem('token', data.userToken)//local storage'da token tutuluyor
        const value = await AsyncStorage.getItem('token');
        console.log("value:",value)
        AlertDialog("Sucess","successfully logged in")
        navigation.replace("Dashboard")
        //navigate('/dashboard')
        //window.location.href = '/dashboard'
      } else {
        AlertDialog("Error","check your username and password")
      }
      */


    } catch (error) {
      console.log("err:",error)
    }

	}

  return (
    <View style={styles.container} >

        <TouchableOpacity style={styles.iconBack} onPress={()=>navigation.navigate("Landing")}>
            <MaterialCommunityIcons 
                    name="arrow-left"
                    size={28} 
                    color="#aaa"
                /> 
        </TouchableOpacity>
      
      {
          height > 700 ? 
          
          <View style={styles.logoContainerTall}>
            <LogoSvg style={styles.svg} />
          </View>

        :
        
          <View style={styles.logoContainerShort}>
            <LogoSvg style={styles.svg} />
          </View>
        }


      <View style={styles.inputContainer}>
        
          <Text style={styles.loginText}>Log in</Text>

          <View style={styles.emailContainer}>
            <TextInput style={styles.input} placeholder={'Email'} placeholderTextColor="#ffc16f" value={email} onChangeText={(text)=>setEmail(text)}/>          
          </View>
          
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
            <TouchableOpacity style={styles.button} onPress={()=>loginUser()}>
              <Text style={styles.buttonText}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainerTall:{
    alignSelf: 'center',
    marginTop: verticalScale(50),
    zIndex:2
},
logoContainerShort:{
  alignSelf: 'center',
  marginTop: verticalScale(30),
  zIndex:2
},
  svg:{
    marginHorizontal:"auto",
  },
  icon: { 
    marginLeft: 10,
  }, 
  emailContainer:{
    marginTop:25,
    marginBottom:30
  },
  loginText:{
    color: '#FF6F61',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  inputContainer:{
    marginTop:verticalScale(50),
    alignItems: 'center'
  },
  input:{
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
  },
  inputPass: { 
    flex: 1, 
    paddingRight: 10,
    paddingVertical: 7, 
    
  }, 
  button:{
    display: 'flex',
    width: horizontalScale(200),
    height: verticalScale(55),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius:8,
    borderWidth:3,
    borderColor:"#FF9F1C",
    backgroundColor:"#F5F5F5"
  },
  buttonText:{
    textAlign: 'center',
    fontFamily: 'ABeeZee',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#FF9F1C'
  },
  buttonContainer:{
    marginTop:30,
  },
  iconBack:{
    position:"absolute",
    marginTop:40,
    marginLeft:10,
    zIndex:1
},
});
