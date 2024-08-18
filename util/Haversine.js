export function Haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the Earth in meters
    const lat1_rad = (lat1 * Math.PI) / 180;
    const lon1_rad = (lon1 * Math.PI) / 180;
    const lat2_rad = (lat2 * Math.PI) / 180;
    const lon2_rad = (lon2 * Math.PI) / 180;
    const delta_lat = lat2_rad - lat1_rad;
    const delta_lon = lon2_rad - lon1_rad;
    const a =
      Math.sin(delta_lat / 2) ** 2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(delta_lon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  