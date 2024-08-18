import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useAuth } from '../authContext/AuthContext';
import Notification from '../components/common/Notification';
import NameOtherSvg from '../svg/nameOtherPages';
import MapView, { Marker, Callout } from 'react-native-maps';
import { verticalScale, height } from '../themes/Metrics';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CustomMarker from '../components/home/CustomMarker';
import { Haversine } from '../util/Haversine';
import { API_KEYS } from './config';

export default function Home(){

  const { user, socket, receiveMessage, setCheckInPlace, setPlaceName, setRoomId, setLocation, displayedMessages, placeExistOrNot } = useAuth();
  const [places, setPlaces] = useState([]);
  const [checkPlacesExistOrNot, setCheckPlacesExistOrNot] = useState({});
  const [loading, setLoading] = useState(false);
  const [triggerMap, setTriggerMap] = useState(false);
  const [triggerPlace, setTriggerPlace] = useState(0);
  const [currentMessage, setCurrentMessage] = useState({});

  const apiKey = API_KEYS.GOOGLE_MAPS_API_KEY;


    useEffect(() => {
      if (receiveMessage && displayedMessages !== receiveMessage.content+receiveMessage.dmId) {
      setCurrentMessage(receiveMessage);
      }
    }, [receiveMessage, displayedMessages]);

    useEffect(() => {
      if(checkPlacesExistOrNot !={}){
        setCheckPlacesExistOrNot(prevState => ({
          ...prevState,
          [placeExistOrNot]: true
        }));
      }

    }, [placeExistOrNot]);

    useEffect(()=>{
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

          let placesArr = restaurants.concat(cafes);

          const uniquePlacesMap = new Map();
          placesArr.forEach(place => {
            uniquePlacesMap.set(place.place_id, place);
          });

          placesArr = Array.from(uniquePlacesMap.values());


          const placeIds = placesArr.map(obj => obj.place_id);

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

    async function checkMovement(currentLatitude, currentLongitude) {
      const distance = Haversine(
          user.latitude,
          user.longitude,
          currentLatitude,
          currentLongitude
      );
      if(distance>50){
        setLocation(currentLatitude, currentLongitude)
        setTriggerMap(true)
        setTriggerPlace(triggerPlace+1)
  
        setTimeout(() => {
          setTriggerMap(false);
        }, 1000);
      }
      
    }

    const handleMarkerPressCreate = async (data) =>{
      const obj = {
        placeId : data.place_id,
        userId: user.userId,
        userName: user.userName,
        preferences: user.preferences,
      }
      socket.emit("createPlace",obj)
  
      await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/place/createPlace', {
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
    }

    const handleMarkerPressJoin = async (data) =>{
      const obj = {
        placeId : data.place_id,
        userId: user.userId,
        userName: user.userName,
        preferences: user.preferences,
      }
      socket.emit("joinToPlace", obj)
      setRoomId(data.place_id)  
      setPlaceName(data.name)
      setCheckInPlace(true)
    }

    return (
      <View style={styles.container}>
        {height > 700 ? (
          <View style={styles.nameContainerTall}>
            <NameOtherSvg />
          </View>
        ) : (
          <View style={styles.nameContainerShort}>
            <NameOtherSvg />
          </View>
        )}
        <Notification message={currentMessage} />
  
        {loading ? (
          <LoadingSpinner />
        ) : (
          <MapView
            onUserLocationChange={(e) => checkMovement(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
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
            {places.map((data) => (
              <CustomMarker
                key={data.place_id}
                data={data}
                user={user}
                checkPlacesExistOrNot={checkPlacesExistOrNot}
                handleMarkerPressCreate={handleMarkerPressCreate}
                handleMarkerPressJoin={handleMarkerPressJoin}
              />
            ))}
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
      width: '100%',
      height: '100%',
    },
    nameContainerShort: {
      position: 'absolute',
      alignSelf: 'center',
      top: 0,
      margin: verticalScale(40),
      zIndex: 5,
    },
    nameContainerTall: {
      position: 'absolute',
      alignSelf: 'center',
      top: 0,
      margin: verticalScale(50),
      zIndex: 5,
    },
  });
