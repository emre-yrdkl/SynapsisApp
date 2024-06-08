import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, ScrollView, Alert, Button, Pressable, Image } from 'react-native';
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
import restaurantNearSmall from '../assets/markers/restaurant_near_small.png';
import restaurantFarSmall from '../assets/markers/restaurant_far_small.png';
import cafeNearSmall from '../assets/markers/cafe_near_small.png';
import cafeFarSmall from '../assets/markers/cafe_far_small.png';
import restaurantNearBig from '../assets/markers/restaurant_near_big.png';
import restaurantFarBig from '../assets/markers/restaurant_far_big.png';
import cafeNearBig from '../assets/markers/cafe_near_big.png';
import cafeFarBig from '../assets/markers/cafe_far_big.png';
import * as Location from 'expo-location';

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


export default function Home(){

    const { user, socket, receiveMessage, setCheckInPlace, setPlaceName, 
            setRoomId, roomId, setLocation, displayedMessages, placeExistOrNot } = useAuth();
    const [places, setPlaces] = useState(0); // Add a key state
    const [check, setCheck] = useState(false)
    const [checkPlacesExistOrNot, setCheckPlacesExistOrNot] = useState({})
    const [loading, setLoading] = useState(false)
    const [triggerMap, setTriggerMap] = useState(false)
    const [triggerPlace, setTriggerPlace] = useState(0)

    const [currentMessage, setCurrentMessage] = useState({});

    useEffect(() => {
      if (receiveMessage && displayedMessages !== receiveMessage.content+receiveMessage.dmId) {
      setCurrentMessage(receiveMessage);
      }
  }, [receiveMessage, displayedMessages]);

    const navigation = useNavigation();


    useEffect(() => {
      console.log("placeExistOrNot", placeExistOrNot)
      if(checkPlacesExistOrNot !={}){
        setCheckPlacesExistOrNot(prevState => ({
          ...prevState,
          [placeExistOrNot]: true
        }));
      }

    }, [placeExistOrNot]);

    /*useEffect(()=>{
      
      const fetchPlacesData = async () =>{
        try {
          const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.108738,29.032098&radius=300&type=restaurant&key=AIzaSyAcKC8DiY_yVRr6_Y5xPtzsaBGZ8-jiqaY`);
          const dataPlaces = await response.json();
          //console.log("user: ", user)
          //console.log("dataPlaces", dataPlaces)
          if(dataPlaces.status == "OK"){

            setPlaces(dataPlaces.results);

            const placeIds = dataPlaces.results.map(obj => obj.place_id);

            //console.log("placeIds", placeIds)
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
    },[])*/

    async function checkMovement(currentLatitude, currentLongitude) {
      
      const distance = haversine(
          user.latitude,
          user.longitude,
          currentLatitude,
          currentLongitude
      );

      if(distance>50){
        console.log("distance",distance)
        setLocation(currentLatitude, currentLongitude)
        setTriggerMap(true)
        setTriggerPlace(triggerPlace+1)
  
        setTimeout(() => {
          setTriggerMap(false);
        }, 1000);
      }
      
    }

    useEffect(()=>{
      
      const apiKey = 'AIzaSyAcKC8DiY_yVRr6_Y5xPtzsaBGZ8-jiqaY';
      const location = `${user.latitude},${user.longitude}`;
      const radius = 600;

      async function fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }
      
      async function getPlacesByType(apiKey, location, radius, placeType) {
        const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
        let places = [];
        let url = `${baseUrl}?location=${location}&radius=${radius}&type=${placeType}&key=${apiKey}`;
        
        let data = await fetchData(url);
        if (data.results) {
          places = places.concat(data.results);
        }
      
        // Handle pagination
        while (data.next_page_token) {
          await new Promise(resolve => setTimeout(resolve, 800)); // 1-second delay
          url = `${baseUrl}?pagetoken=${data.next_page_token}&key=${apiKey}`;
          data = await fetchData(url);
          if (data.results) {
            places = places.concat(data.results);
          }
        }
      
        return places;
      }
      
      async function getRestaurantsAndCafes(apiKey, location, radius) {
        if(triggerPlace == 0){
          setLoading(true)
        }
        const restaurantPromise = getPlacesByType(apiKey, location, radius, 'restaurant');
        const cafePromise = getPlacesByType(apiKey, location, radius, 'cafe');
        
        const [restaurants, cafes] = await Promise.all([restaurantPromise, cafePromise]);
        return {
          restaurants,
          cafes
        };
      }

      getRestaurantsAndCafes(apiKey, location, radius)
        .then(async ({ restaurants, cafes }) => {
          console.log('Restaurants:', restaurants.length);
          console.log('Cafes:', cafes.length);

          let placesArr = restaurants.concat(cafes);

          const uniquePlacesMap = new Map();
          placesArr.forEach(place => {
            uniquePlacesMap.set(place.place_id, place);
          });

          placesArr = Array.from(uniquePlacesMap.values());


          const placeIds = placesArr.map(obj => obj.place_id);

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

          const checkPlacesObject = {
            placeIdArray : placeIds,
            userId: user.userId
          }
          socket.emit("checkPlacesObject",checkPlacesObject) 

          setCheckPlacesExistOrNot(dataPlacesExistOrNot)
          setPlaces(placesArr)
          setCheck(true)
          if(triggerPlace == 0){
            setLoading(false)
          }
        })
        .catch(error => console.error('Error:', error));
          }
    ,[triggerPlace])


    const handleMarkerPressCreate = async (data) =>{
      console.log("marker press")
      const obj = {
        placeId : data.place_id,
        userId: user.userId,
        userName: user.userName,
        preferences: user.preferences,
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
      setPlaceName(data.name)
      setCheckInPlace(true)

      //console.log("response", await response.json())
    }

    const handleMarkerPressJoin = async (data) =>{

      const obj = {
        placeId : data.place_id,
        userId: user.userId,
        userName: user.userName,
        preferences: user.preferences,
      }
      //console.log("obj:", obj)
      socket.emit("joinToPlace", obj)
      setRoomId(data.place_id)  
      setPlaceName(data.name)
      setCheckInPlace(true)
    }

    return(
      <View style={styles.container}>
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
        <Notification message={currentMessage} />
    
        {loading ? (
          <View style={styles.loadingContainer}>
            <Image source={require('../assets/gifs/loading.gif')} style={styles.loadingImage}/>
          </View>
        ) : (
          <MapView
            onUserLocationChange={e => {checkMovement(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}}
            style={styles.map}
            initialRegion={{
              latitude: user.latitude,
              longitude: user.longitude,
              latitudeDelta: 0.0065,
              longitudeDelta: 0.003,
            }}
            showsUserLocation={true}
            scrollEnabled={true}
            minZoomLevel={16}
            maxZoomLevel={20}
            rotateEnabled={false}
            loadingEnabled={true}
            followsUserLocation={triggerMap}

          >
            {check &&
              places.map(data =>{
                if(haversine(data.geometry.location.lat, data.geometry.location.lng, user.latitude, user.longitude) < 400){
                  if(checkPlacesExistOrNot[data.place_id]){
                    return( 
                      <Marker 
                        key={data.place_id} 
                        coordinate={{latitude:data.geometry.location.lat, longitude:data.geometry.location.lng}}
                        zindex={2}
                        title={`${data.name}`}
                        description={`${data.name}`}  
                        image={data.types.includes("cafe") ? height>700 ? cafeNearBig :cafeNearSmall : height>700 ? restaurantNearBig :restaurantNearSmall}   
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
                    );
                  } else {
                    return( 
                      <Marker 
                        key={data.place_id} 
                        coordinate={{latitude:data.geometry.location.lat, longitude:data.geometry.location.lng}}
                        zindex={2}
                        title={`${data.name}`}
                        description={`${data.name}`}  
                        image={data.types.includes("cafe") ? height>700 ? cafeNearBig :cafeNearSmall : height>700 ? restaurantNearBig :restaurantNearSmall}   
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
                    );
                  }
                } else {   
                  return(
                    <Marker
                      key={data.place_id} 
                      coordinate={{latitude:data.geometry.location.lat, longitude:data.geometry.location.lng}}
                      zindex={2}
                      title={`${data.name}`}
                      description={`${data.name}`}  
                      image={data.types.includes("cafe") ? height>700 ? cafeFarBig : cafeFarSmall : height>700 ?  restaurantFarBig :restaurantFarSmall}
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
                  );
                }
              })
            }
          </MapView>
        )}
      </View>
    );
    
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%", 
    height: "100%"
  },
  nameContainerShort: {
    position: "absolute",
    alignSelf: 'center',
    top: 0,
    margin: verticalScale(40),
    zIndex: 5
  },
  nameContainerTall: {
    position: "absolute",
    alignSelf: 'center',
    top: 0,
    margin: verticalScale(50),
    zIndex: 5
  },
  calloutView: {
    alignSelf: 'center', 
    padding: 4, 
    marginTop: 10, 
    borderRadius: 6, 
    backgroundColor: "#FF9F1C"
  },
  calloutHeader: {
    fontSize: 16
  },
  calloutText: {
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#fefefe"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  loadingImage: {
    width: 250,
    height: 250,
  },
});
