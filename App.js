import { StyleSheet, Text, View } from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import Sign from './pages/signPage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/signUpPage';
import { AuthProvider } from './authContext/AuthContext';
import Landing from './pages/Landing';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import Chat from './items/Chat';
import Preferences from './pages/Preferences';
import OthersProfile from './pages/OthersProfile';

const Stack = createNativeStackNavigator();

const fetchFonts = async () => {
  return await Font.loadAsync({
    'ABeeZeeRegular': require('./assets/fonts/ABeeZee-Regular.ttf'),
    'ArialRoundedMTBold': require('./assets/fonts/arlrdbd.ttf'),
    // Add other font styles if needed (e.g., bold, italic)
  });
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  console.log("sago3")
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await fetchFonts()
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    console.log("sago")
    return null;
  }
  console.log("sago2")
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name="Landing"  component={Landing} options={{ headerShown: false }}/>
          <Stack.Screen name="Sign"  component={Sign} options={{ headerShown: false }}/>
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
          <Stack.Screen name="OthersProfile" component={OthersProfile} options={{ headerShown: false }} />
          <Stack.Screen name="Preferences" component={Preferences} options={{ headerShown: false }} />  

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
