import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import CustomCalloutNear from './CustomCalloutNear';
import CustomCalloutFar from './CustomCalloutFar';
import { height } from '../../themes/Metrics';
import {
  cafeNearBig,
  cafeNearSmall,
  cafeFarBig,
  cafeFarSmall,
  restaurantNearBig,
  restaurantNearSmall,
  restaurantFarBig,
  restaurantFarSmall,
} from '../assets/markers';
import { Haversine } from '../../util/Haversine';

const CustomMarker = ({ data, user, checkPlacesExistOrNot, handleMarkerPressCreate, handleMarkerPressJoin }) => {
  const isNearby = Haversine(data.geometry.location.lat, data.geometry.location.lng, user.latitude, user.longitude) < 400;
  const isCafe = data.types.includes('cafe');
  const isLargeScreen = height > 700;
  const markerImage = isNearby
    ? isCafe
      ? isLargeScreen
        ? cafeNearBig
        : cafeNearSmall
      : isLargeScreen
      ? restaurantNearBig
      : restaurantNearSmall
    : isCafe
    ? isLargeScreen
      ? cafeFarBig
      : cafeFarSmall
    : isLargeScreen
    ? restaurantFarBig
    : restaurantFarSmall;

  return (
    <Marker
      coordinate={{ latitude: data.geometry.location.lat, longitude: data.geometry.location.lng }}
      title={data.name}
      description={data.name}
      image={markerImage}
      onCalloutPress={() => {
        checkPlacesExistOrNot[data.place_id] ? handleMarkerPressJoin(data) : handleMarkerPressCreate(data);
      }}
    >
      <Callout tooltip>
        {isNearby ? (
          <CustomCalloutNear>
            <CalloutContent name={data.name} action={checkPlacesExistOrNot[data.place_id] ? 'JOIN' : 'CREATE'} />
          </CustomCalloutNear>
        ) : (
          <CustomCalloutFar>
            <CalloutContent name={data.name} />
          </CustomCalloutFar>
        )}
      </Callout>
    </Marker>
  );
};

const CalloutContent = ({ name, action }) => (
  <View>
    <Text style={{ fontSize: 16 }}>{name}</Text>
    {action && (
      <View style={{ alignSelf: 'center', padding: 4, marginTop: 10, borderRadius: 6, backgroundColor: '#FF9F1C' }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fefefe' }}>{action}</Text>
      </View>
    )}
  </View>
);

export default CustomMarker;
