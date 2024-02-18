import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import SvgComponent from '../svg/test';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LogoSvg from '../svg/logo';

const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);


export default function SignUp({navigation}) {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [repassword,setRepassword] = useState("")

  const [showPassword, setShowPassword] = useState(false); 
  
    // Function to toggle the password visibility state 
    const toggleShowPassword = () => { 
        setShowPassword(!showPassword); 
    }; 

  async function registerUser() {
		//event.preventDefault()//onsubmit işlemini yapmayacak. oluşan eventin işlevi geçersiz kılınır.
    if(password == repassword){
      try {
        console.log("register","name",name,
        "email",email,
        "password", password,);
        const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/register', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              "name":name,
              "email":email,
              "password": password,
          }),
        })
    
        const data = await response.json()
  
        console.log("data: ",data.userName)
    
        if (data.userName === name) {//burası değişecek status == success
          console.log("success")
          AlertDialog("Sucess","successfully registered")
          navigation.replace("Sign")
  
          //navigate('/login')
        }else{
          console.log("fail")
          AlertDialog("Error","Register error")
        }      
      } catch (error) {
        console.log("error::",error)
      }
    }else{
      AlertDialog("Error","Password does not match")
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
        
      
      <View style={styles.logoContainer}>
          <LogoSvg style={styles.svg} />
      </View>

      <View style={styles.inputContainer}>
        
          <Text style={styles.signupText}>Sign Up</Text>

          <View style={styles.emailContainer}>
            <TextInput style={styles.input} placeholder={'Email'} placeholderTextColor="#ffc16f" value={email} onChangeText={(text)=>setEmail(text)}/>          
          </View>

          
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

          <View style={[styles.input, {marginTop: 20}]} > 
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
            <TouchableOpacity style={styles.button} onPress={()=>registerUser()}>
              <Text style={styles.buttonText}>
                Register
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
  
  logoContainer:{
    alignSelf: 'center',
    marginTop:80
  },
  svg:{
    marginHorizontal:"auto",
  },

  emailContainer:{
    marginTop:25,
    marginBottom:30
  },
  inputContainer:{
    marginTop:50,
    alignItems: 'center'
  },
  input:{
    display: 'flex',
    flexDirection: 'row',
    width: 300,
    height: 48,
    padding: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9F1C',
    outlineStyle: 'none'
  },

  passwordView:{
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    flex:1,
    width:"80%",
    borderRadius:10,
    borderWidth:2,
    borderColor:"#AFB1B6",
    paddingVertical:10,
    paddingHorizontal:10,
    backgroundColor:"#FFF",

  },

icon: { 
  marginLeft: 10,
}, 

iconBack:{
    position:"absolute",
    marginTop:40,
    marginLeft:10,
    zIndex:1
},

  signupText:{
    color: '#FF6F61',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  
  input2: { 
    flex: 1, 
    paddingVertical: 7, 
    paddingRight: 10,
    outlineStyle: 'none'
}, 
  button:{
    display: 'flex',
    width: 280,
    height: 51,
    padding: '9px 87px 9px 88px',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius:8,
    borderWidth:3,
    borderColor:"#F5F5F5",
    backgroundColor:"#FF9F1C"
    
  },
  buttonText:{
    textAlign: 'center',
    fontFamily: 'ABeeZee',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#F5F5F5'
  },
  buttonContainer:{
    marginTop:30,
  }
});
