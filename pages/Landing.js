import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LogoSvg from '../svg/logo';
import NameSvg from '../svg/nameLanding';
import BackgroundLogoSvg from '../svg/backgroundLogo';
import * as Location from 'expo-location';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';
import BackgroundLogoSvgSmall from '../svg/backgroundLogoSvgSmall';
import { useEffect } from 'react';
import { useAuth } from '../authContext/AuthContext';
import { CommonActions  } from '@react-navigation/native';

export default function Landing({navigation}) {

  const { setLocation } = useAuth();

  useEffect( ()=>{

    async function getLocation(){
      console.log("sa")
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert('Error', 'Permission to access location was denied.');
      }
      const locationInfo = await Location.getCurrentPositionAsync({})
      console.log("locationInfo",locationInfo)
      setLocation(locationInfo.coords.latitude, locationInfo.coords.longitude)
      
      
    }
    getLocation() 



    console.log("width",width, "height",height)
  },[])
    //navigation.replace("SignUp")
    //https://react-svgr.com/playground/?native=true
    return (
        <View style={styles.container} >
        {
          height > 700 ? 
          <>
          <View style={styles.backgroundSvgContainer}>
            <BackgroundLogoSvg />  
          </View>
          <View style={{...styles.logoContainerTall, width: 189, height: 171 }}>
            <LogoSvg style={styles.svg} />
          </View>
          </>

        :
        <>
          <View style={styles.backgroundSvgContainer}>
            <BackgroundLogoSvgSmall />  
          </View>
          <View style={{...styles.logoContainerShort, width: 189, height: 171 }}>
            <LogoSvg style={styles.svg} />
          </View>
        </>
        }

        <View style={styles.nameContainer}>
            <NameSvg style={styles.svg} />
        </View>

        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.loginContainer} onPress={()=>navigation.navigate("Sign")}>
                <Text style={styles.loginText}>
                    Log in
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerContainer} onPress={()=>navigation.navigate("SignUp")}>
                <Text style={styles.registerText}>
                    Register
                </Text>
            </TouchableOpacity>
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
        marginTop: verticalScale(60),
        zIndex:2
    },
    logoContainerShort:{
      alignSelf: 'center',
      marginTop: verticalScale(60),
      zIndex:2
  },
    svg:{
        marginHorizontal:"auto",
    },

    nameContainer:{
        alignSelf: 'center',
        marginTop:verticalScale(20)
    },
    backgroundSvgContainer: {
        position: 'absolute',
        bottom:0,
        zIndex:-1
    },
    loginContainer:{
        alignSelf: 'center',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#FF9F1C',
        backgroundColor: '#F5F5F5',
        width: horizontalScale(250),
        height: 51,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:26
    },
    loginText:{
        color: '#FF9F1C',
        textAlign: 'center',
        fontFamily: 'ABeeZeeRegular',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: '400',
    },
    registerContainer:{
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
    registerText:{
        color: '#F5F5F5',
        textAlign: 'center',
        fontFamily: 'ABeeZeeRegular',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: '400',
    },
    buttonsContainer:{
        marginTop: verticalScale(110)
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
    paddingVertical: 10, 
    paddingHorizontal:10,
    backgroundColor:"#FFF",

  },

  container2: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#f3f3f3', 
    borderRadius: 8, 
    paddingHorizontal: 14, 
}, 

icon: { 
  marginLeft: 10,
}, 

  login:{
    fontSize: 35,
    marginBottom:20,
    fontFamily: '',
  },
  
  
  inputContainer:{
    marginTop:100,
    alignItems: 'center'

  },
  input:{
    flex:1,
    backgroundColor:"#FFF",
    width:"80%",
    paddingVertical:12,
    paddingHorizontal:10,
    borderRadius:10,
    borderWidth:2,
    borderColor:"#AFB1B6",
    marginBottom:20,
  },
  
  input2: { 
    flex: 1, 
    paddingRight: 10,
    paddingVertical: 7, 
    
}, 
  buttonLeft:{
    flex: 0.7,
    paddingVertical:10,
    backgroundColor:"#EFEFF0",
    borderRadius:7,
    borderColor:"#AFB1B6",
    borderWidth:2,
    
    marginRight:15
  },
  buttonRight:{
    flex: 0.3,
    paddingVertical:10,
    backgroundColor:"#EFEFF0",
    borderRadius:7,
    borderColor:"#AFB1B6",
    borderWidth:2,

  },
  buttonText:{
    fontSize:15,
    textAlign: 'center',
  },
  buttonContainer:{
    width:"80%",
    flexDirection:"row",
    marginTop:30,
  }
});
