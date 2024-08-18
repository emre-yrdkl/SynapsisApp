import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Ionicon from "@expo/vector-icons/Ionicons"
import Home from './Home';
import Profile from './Profile';
import FriendList from './FriendList';
import DirectMessage from './DirectMessage';
import Place from './Place';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../authContext/AuthContext';

export default function Dashboard(){

    const Tabs = createBottomTabNavigator()
    const { checkInPlace } = useAuth();


    return(
      <Tabs.Navigator>
        {
          checkInPlace ?
          <Tabs.Screen name="place" component={Place} options={{title:"place", tabBarShowLabel: false, headerShown:false, tabBarIcon: (props) => <Ionicon name = "log-out" size={25} {...props}/>}}/>
          :
          <Tabs.Screen name="Home" component={Home} options={{title:"Home", tabBarShowLabel: false, headerShown:false, tabBarIcon: (props) => <Ionicon name = "home-outline" size={25} {...props}/>}}/>

        }
        <Tabs.Screen name="ProfileStack" component={Profile} options={{title:"Profile", tabBarShowLabel: false, headerShown:false, tabBarIcon: (props) => <Ionicon name = "person" {...props}/>}}/>
        <Tabs.Screen name="FriendListStack" component={FriendList} options={{title:"FriendList", tabBarShowLabel: false, headerShown:false, tabBarIcon: (props) => <FontAwesome5 name = "user-friends" {...props}/>}}/>
        <Tabs.Screen name="DirectMessageStack" component={DirectMessage} options={{title:"DirectMessage", tabBarShowLabel: false, headerShown:false, tabBarIcon: (props) => <AntDesign  name = "message1" size={25} {...props}/>}}/>
      </Tabs.Navigator>
    )
}