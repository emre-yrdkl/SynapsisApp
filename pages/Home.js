import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, ScrollView, Alert, Button, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../authContext/AuthContext';
import Chat from '../items/Chat';
import { useNavigation } from '@react-navigation/native';
import NameOtherSvg from '../svg/nameOtherPages';
import SearchSvg from '../svg/search';
import Notification from '../items/Notification';
import MapView, { Overlay, Polygon, Circle, Marker, Callout  } from 'react-native-maps';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';
import CustomCalloutFar from '../items/CustomCalloutFar';
import CustomCalloutNear from '../items/CustomCalloutNear';
import restaurantclose from '../assets/markers/restaurantyakingolge2.png';
import restaurantfar from '../assets/markers/restaurant2golge2.png';



//----------------------------------------------------------------
//----------------------------------------------------------------

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters

  // Convert latitude and longitude from degrees to radians
  const lat1_rad = lat1 * Math.PI / 180;
  const lon1_rad = lon1 * Math.PI / 180;
  const lat2_rad = lat2 * Math.PI / 180;
  const lon2_rad = lon2 * Math.PI / 180;

  // Calculate the differences between the coordinates
  const delta_lat = lat2_rad - lat1_rad;
  const delta_lon = lon2_rad - lon1_rad;

  // Calculate the Haversine formula
  const a = Math.sin(delta_lat / 2) ** 2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(delta_lon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = R * c;
  return distance;
}


const AlertDialog = (title,message) =>
Alert.alert(title, message, [
  {text: 'OK', onPress: () => console.log('OK Pressed')},
]);

function getInitials(fullName) {
  const words = fullName.split(' ');

  let initials = '';

  for (const word of words) {
    if (word.length > 0) {
      initials += word[0].toUpperCase();
    }
  }
  console.log("initial: ",initials)
  return initials;
}

export default function Home(){

    const { user, socket, receiveMessage, setCheckInPlace, checkInPlace, setRoomId, roomId } = useAuth();
    const [key, setKey] = useState(0); // Add a key state
    const [places, setPlaces] = useState(0); // Add a key state
    const [check, setCheck] = useState(false)
    const [checkPlacesExistOrNot, setCheckPlacesExistOrNot] = useState({})

    const navigation = useNavigation();

    useEffect(()=>{41.108802, 29.031637
      
      const fetchPlacesData = async () =>{
        try {
          const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.108802,29.031637&radius=300&type=restaurant&key=AIzaSyDuSMI9n5AEwexMJJ_qxwc3jwBQIihXlJ4`);
          const dataPlaces = await response.json();
          console.log("user: ", user)

          if(dataPlaces.status == "OK"){

            setPlaces(dataPlaces.results);

            const placeIds = dataPlaces.results.map(obj => obj.place_id);

            console.log("placeIds", placeIds)
            const responseCheckPlacesExistOrNot = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/place/checkPlaces', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
              },
              body: JSON.stringify({
                  "placeIdArray":placeIds 
              })  
            })  
            const dataPlacesExistOrNot = await responseCheckPlacesExistOrNot.json()

            setCheckPlacesExistOrNot(dataPlacesExistOrNot)

            setCheck(true)
          }
  
        } catch (error) {
          console.log("error",error)
        }
      }

      fetchPlacesData()
    },[])


    useEffect(()=>{
      console.log("receiveMessage",receiveMessage)
      showNotification()
    },[receiveMessage])


    const handleMarkerPressCreate = async (data) =>{
      console.log("marker press")
      const obj = {
        placeId : data.place_id,
        userId: user.userId,
        userName: user.userName,
        userImageUrl:"xxxxxxxxxxxx"
      }
      socket.emit("createPlace",obj)
  
      const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/place/createPlace', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "placeId":data.place_id,            
            "userId": user.userId   
        })  
      })
      setRoomId(data.place_id)  
      setCheckInPlace(true)

      console.log("response", await response.json())
    }

    const handleMarkerPressJoin = async (data) =>{
      console.log("joi", data.place_id) 
      const obj = {
        placeId : data.place_id,
        userId: user.userId,
        userName: user.userName,
        userImageUrl:"xxxxxxxxxxxx"
      }
      console.log("obj:", obj)
      socket.emit("joinToPlace", obj)
      setRoomId(data.place_id)  
      setCheckInPlace(true)
    }

    
    const showNotification = () => {
      // Update the message with a unique key every time
      setKey(prevKey => prevKey + 1); // Increment key to force re-render
    };


    return(
        <View>

          {
            height > 700 ?
            <View style={styles.nameContainerTall}>
              <NameOtherSvg/>
            </View>
            :
            <View style={styles.nameContainerShort}>
              <NameOtherSvg/>
            </View>
          }
          <Notification key={key} message={receiveMessage} />

          <MapView
          style={styles.map}
          initialRegion={{
            latitude: 41.108802,
            longitude: 29.031637,
            latitudeDelta: 0.0065,
            longitudeDelta: 0.003,
          }}
          scrollEnabled={true}
          minZoomLevel={16}
          maxZoomLevel={20}
          rotateEnabled={false}
        >


{
      check &&
      places.map(data =>{

          if(haversine(data.geometry.location.lat, data.geometry.location.lng, 41.108802, 29.031637) < 200){

            if(checkPlacesExistOrNot[data.place_id]){

              return( 
                <Marker 
                  key={data.place_id} 
                  coordinate={{latitude:data.geometry.location.lat, longitude:data.geometry.location.lng}}
                  zindex={2}
                  title={`${data.name}`}
                  description={`${data.name}`}  
                  image={restaurantclose}   
                  onPress={e => console.log("marker press")}
                  onCalloutPress={e => handleMarkerPressJoin(data)} 
                >
                  <Callout
                  alphaHitTest
                  tooltip
                  onPress={_ => {
                    console.log('callout pressed')  
                  }}
                  style={{}}>
                    <CustomCalloutNear>
                      <View style={{}}>
                        <View style={{}}>
                          <Text style={styles.calloutHeader}>{`${data.name}`}</Text>
                        </View> 
                        <View style={styles.calloutView}> 
                          <Text style={styles.calloutText}>JOIN</Text> 
                        </View>
                      </View> 
                    </CustomCalloutNear>
                  </Callout>
                </Marker>
                )

            }else{


              return( 
                <Marker 
                  key={data.place_id} 
                  coordinate={{latitude:data.geometry.location.lat, longitude:data.geometry.location.lng}}
                  zindex={2}
                  title={`${data.name}`}
                  description={`${data.name}`}  
                  image={restaurantclose}   
                  onPress={e => console.log("marker press")}
                  onCalloutPress={e => handleMarkerPressCreate(data)} 
                >
                  <Callout
                  alphaHitTest
                  tooltip
                  onPress={_ => {
                    console.log('callout pressed')  
                  }}
                  style={{}}>
                    <CustomCalloutNear>
                      <View style={{}}>
                        <View style={{}}>
                          <Text style={styles.calloutHeader}>{`${data.name}`}</Text>
                        </View> 
                        <View style={styles.calloutView}> 
                          <Text style={styles.calloutText}>CREATE</Text> 
                        </View>
                      </View> 
                    </CustomCalloutNear>
                  </Callout>
                </Marker>
                )
                
                
            }

          } 
          else{   
            return(
              <Marker
                key={data.place_id} 
                coordinate={{latitude:data.geometry.location.lat, longitude:data.geometry.location.lng}}
                zindex={2}
                title={`${data.name}`}
                description={`${data.name}`}  
                image={restaurantfar}
                onPress={e => console.log("e.nativeEvent2: ", data)}
                onCalloutPress={e => console.log("haha")} 
              >
                <Callout
                alphaHitTest
                tooltip
                onPress={_ => {
                  console.log('callout pressed')  
                }}
                style={{}}>
                  <CustomCalloutFar>
                    <View style={{}}>
                      <View style={{}}>
                        <Text style={styles.calloutHeader}>{`${data.name}`}</Text>
                      </View> 
                    </View> 
                  </CustomCalloutFar> 
                </Callout>
              </Marker>
              )
          }

      })
    }

        </MapView>
        
      </View>
    )
}

const styles = StyleSheet.create({
  map:{
    width:"100%", 
    height:"100%"
  },
  nameContainerShort:{
    position:"absolute",
    alignSelf: 'center',
    top: 0,
    margin:verticalScale(30),
    zIndex:5
  },
  nameContainerTall:{
    position:"absolute",
    alignSelf: 'center',
    top: 0,
    margin:verticalScale(50),
    zIndex:5
  },
  calloutView:{
    alignSelf: 'center', 
    padding:4, 
    marginTop:10, 
    borderRadius:6, 
    backgroundColor:"#FF9F1C"
  },
  calloutHeader:{
    fontSize:16
  },
  calloutText:{
    fontSize:14, 
    fontWeight:"bold", 
    color:"#fefefe"
  }
})