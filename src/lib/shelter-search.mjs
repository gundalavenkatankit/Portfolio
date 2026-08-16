export function isPostalCode(value) {
  return /^\d{5}$/.test(value.trim());
}

export function buildGeocodeQuery(location, area) {
  const value = location.trim();
  return isPostalCode(value) ? `${value}, United States` : `${value}, ${area}, United States`;
}

export function distanceInMiles(firstLatitude, firstLongitude, secondLatitude, secondLongitude) {
  const radians = degrees => degrees * Math.PI / 180;
  const latitudeDifference = radians(secondLatitude - firstLatitude);
  const longitudeDifference = radians(secondLongitude - firstLongitude);
  const value = Math.sin(latitudeDifference / 2) ** 2 + Math.cos(radians(firstLatitude)) * Math.cos(radians(secondLatitude)) * Math.sin(longitudeDifference / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function rankNearestShelters(shelters, origin, limit = 10) {
  return shelters
    .filter(shelter => typeof shelter.latitude === "number" && typeof shelter.longitude === "number")
    .map(shelter => ({ ...shelter, distanceMiles: Math.round(distanceInMiles(origin.latitude, origin.longitude, shelter.latitude, shelter.longitude) * 10) / 10 }))
    .sort((first, second) => first.distanceMiles - second.distanceMiles)
    .slice(0, limit);
}
