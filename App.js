import { StyleSheet, Text, View } from 'react-native';
import {useState, useEffect} from 'react';
import Sign from './pages/signPage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/signUpPage';
import { AuthProvider } from './authContext/AuthContext';
import Landing from './pages/Landing';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import Chat from './items/Chat';
const Stack = createNativeStackNavigator();

const fetchFonts = () => {
  return Font.loadAsync({
    'ABeeZee': require('./assets/fonts/ABeeZee-Regular.ttf'),
    'ArialRoundedMTBold': require('./assets/fonts/arlrdbd.ttf'),
    // Add other font styles if needed (e.g., bold, italic)
  });
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.error(err)}
      />
    );
  }
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Landing"  component={Landing} options={{ headerShown: false }}/>
          <Stack.Screen name="Sign"  component={Sign} options={{ headerShown: false }}/>
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#96B6C5',
  },
});
