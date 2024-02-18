import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LogoSvg from '../svg/logo';
import NameSvg from '../svg/nameLanding';
import BackgroundLogoSvg from '../svg/backgroundLogo';
export default function Landing({navigation}) {
    //navigation.replace("SignUp")
    //https://react-svgr.com/playground/?native=true
    return (
        <View style={styles.container} >

        <View style={styles.backgroundSvgContainer}>
            <BackgroundLogoSvg />  
        </View>
        
        <View style={styles.logoContainer}>
            <LogoSvg style={styles.svg} />
        </View>

        <View style={styles.nameContainer}>
            <NameSvg style={styles.svg} />
        </View>

        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.loginContainer} onPress={()=>navigation.replace("Sign")}>
                <Text style={styles.loginText}>
                    Log in
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerContainer} onPress={()=>navigation.replace("SignUp")}>
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
    logoContainer:{
        alignSelf: 'center',
        marginTop:80
    },
    svg:{
        marginHorizontal:"auto",
    },

    nameContainer:{
        alignSelf: 'center',
        marginTop:28
    },
    backgroundSvgContainer: {
        position: 'absolute',
        bottom:0
    },
    loginContainer:{
        alignSelf: 'center',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#FF9F1C',
        backgroundColor: '#F5F5F5',
        width: 300,
        height: 51,
        paddingVertical: 9,
        paddingHorizontal: 98,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:26
    },
    loginText:{
        color: '#FF9F1C',
        textAlign: 'center',
        fontFamily: 'ABeeZee',
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
        width: 300,
        height: 51,
        paddingVertical: 9,
        paddingHorizontal: 98,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText:{
        color: '#F5F5F5',
        textAlign: 'center',
        fontFamily: 'ABeeZee',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: '400',
    },
    buttonsContainer:{
        marginTop: 243
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
