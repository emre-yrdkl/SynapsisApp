import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import Sign from './pages/signPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/signUpPage';
import { AuthProvider } from './authContext/AuthContext';
import Landing from './pages/Landing';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Chat from './items/Chat';
import Preferences from './pages/Preferences';
import OthersProfile from './pages/OthersProfile';

const Stack = createNativeStackNavigator();

const fetchFonts = async () => {
  try {
    await Font.loadAsync({
      ABeeZeeRegular: require('./assets/fonts/ABeeZee-Regular.ttf'),
      ArialRoundedMTBold: require('./assets/fonts/arlrdbd.ttf'),
      // Fallback font to test if the issue is with ArialRoundedMTBold
    });
  } catch (error) {
    console.error('Error loading fonts', error);
  }
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await fetchFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
          <Stack.Screen name="Sign" component={Sign} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
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
